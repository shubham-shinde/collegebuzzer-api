import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET, ROLES } from '../../appconfig'

import { Clubs } from '../../mongoose/mongoosConfig'

export default {
    post : _post
}

function _post (req, res, next) {
    req.checkBody('_id','wrong credential').isMongoId()
    req.checkBody('password', 'wrong credential').isLength({min: 6, max: 15})

    var errors = req.validationErrors();

    if (errors) {
        res.json({error: errors});
        return;
    }
    else {
        const login_detail = {
            _id: req.body._id,
            password : req.body.password
        }

        Clubs.findOne({_id : login_detail._id}).exec((err,student) => {
            if(err)
                next(err)

            if(!student) {
                res.status(404);
                return res.json({
                    msg : "no user found",
                    status: false,
                    code : 404
                })
            }

            bcrypt.compare(login_detail.password, student.password).then((isValid) => {
                if(!isValid) {
                    res.status(401)
                    return res.json({
                        msg: "wrong credencial",
                        status: false,
                        code: 401
                    })
                }
                const token = jwt.sign(
                    { Id: student._id, role: ROLES[1] },
                    SESSION_SECRET
                );
                const sessionString = "fucked_up_students"+student._id ;
        
                req.store.hmset(
                    [
                        sessionString,
                        "mail",
                        student.mail,
                        "role",
                        ROLES[1],
                        "Id",
                        student._id
                    ],
                    function (err, redisRes) {
                        if (err) {
                            return next(err);
                        }
                        console.log("redis res", redisRes);
                        res.status(200);
                        return res.json({
                            msg: "Student successfully logged in ",
                            token: token,
                            status: true,
                            code: 200
                        });
                    }
                );
            }).catch(function (err) {
            next(err);
            });
        })
    }
}