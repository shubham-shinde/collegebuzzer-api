import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET, ROLES } from '../../appconfig'

import { Students, Guests } from '../../mongoose/mongoosConfig'

export default {
    post : _post
}

function _post (req, res, next) {
    console.log(req.body)
    req.checkBody('mail','wrong credential').isEmail();
    req.checkBody('password', 'wrong credential').isLength({min: 6, max: 15})

    var errors = req.validationErrors();

    if (errors) {
        res.json({error: errors});
        return;
    }
    else {
        const login_detail = {
            mail : req.body.mail,
            password : req.body.password
        }
        

        Guests.findOne({mail: login_detail.mail}).exec((err,student) => {
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
                    { Id: student._id, role: ROLES[3] , mail: student.mail},
                    SESSION_SECRET
                );
                        res.status(200);
                        return res.json({
                            msg: "Student successfully logged in ",
                            token: token,
                            status: true,
                            code: 200
                        });
            }).catch(function (err) {
                next(err);
            });
        })
    }
}