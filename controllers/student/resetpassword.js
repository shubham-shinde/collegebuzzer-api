import { Students } from '../../mongoose/mongoosConfig';
import jwt from 'jsonwebtoken';
import sendSetPasswordMail from '../../services/mailService'
// import bycrpt from 'bcryptjs'
import { SESSION_SECRET, SERVER_URL, ROLES } from '../../appconfig';
// import path from 'path'

export default {
    get : _get
}

function _get (req, res, next) {
        Students.find({ mail: req.session.mail }).exec((err, doc) => {
            if(err) {
                next(err)
            }
            if(doc) {
                console.log(doc)
                const token = jwt.sign(
                    { mail: req.session.mail,role: ROLES[1], branch: doc.branch, year: doc.year },
                    SESSION_SECRET
                );
                const link = SERVER_URL+'/setpassword/student/'+token.toString()

                const newStuString = 'student'+token

                req.store.hmset(newStuString,{
                    mail: req.session.mail,role: ROLES[0], branch: doc.branch, year: doc.year , exist: true
                    },
                    function (err, redisRes) {
                        if (err) {
                            return next(err);
                        }
                        req.store.expire(newStuString, 60*30)
                        sendSetPasswordMail({to: req.session.mail, link});
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