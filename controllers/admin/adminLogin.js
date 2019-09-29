import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET, ROLES } from '../../appconfig'

import { Admins } from '../../mongoose/mongoosConfig'

export default {
    post : _post
}

function _post (req, res, next) {
    req.checkBody('mail','wrong credential').isEmail();
    req.checkBody('password', 'wrong credential').isLength({min: 6, max: 15})

    var errors = req.validationErrors();

    if (errors) {
        res.json({error: errors});
        return;
    }
    else {
        const login_detail = {
            mail: req.body.mail,
            password : req.body.password
        }

        Admins.findOne({mail: login_detail.mail}).exec((err,student) => {
            if(err)
                next(err)

            if(!student) {
                res.status(404);
                return res.json({
                    msg : "fuck you bitch",
                    status: false,
                    code : 404
                })
            }

            bcrypt.compare(login_detail.password, student.password).then((isValid) => {
                if(!isValid) {
                    res.status(404)
                    return res.json({
                        msg: "fuck you bitch",
                        status: false,
                        code: 404
                    })
                }
                const token = jwt.sign(
                    { Id: student._id, role: ROLES[2] , mail: student.mail},
                    SESSION_SECRET
                );
                        res.status(200);
                        return res.json({
                            msg: "hello shubham",
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