import { Students } from '../../mongoose/mongoosConfig';
import jwt from 'jsonwebtoken';
import sendSetPasswordMail from '../../services/mailService'
// import bycrpt from 'bcryptjs'
import { SESSION_SECRET, SERVER_URL, ROLES } from '../../appconfig';
// import path from 'path'

export default {
    post : _post
}

function _post (req, res, next) {
    const mail = req.body.mail;
        Students.find({ mail: mail }).exec((err, doc) => {
            if(err) {
                next(err)
            }
            if(doc) {
                console.log(doc)
                const token = jwt.sign(
                    { mail: mail ,role: ROLES[1], branch: doc.branch, year: doc.year },
                    SESSION_SECRET
                );
                const link = SERVER_URL+'/setpassword/student/'+token.toString()

                const newStuString = 'student'+token

                req.store.hmset(newStuString,{
                    mail: mail ,role: ROLES[0], branch: doc.branch, year: doc.year , exist: true
                    },
                    function (err, redisRes) {
                        if (err) {
                            return next(err);
                        }
                        req.store.expire(newStuString, 60*30)
                        sendSetPasswordMail({to: mail , link});
                        res.status(201);
                        return res.json({
                            msg: 'link has been send',
                            status: true,
                            code: 201
                        });
                    }
                );
            }
        })
}