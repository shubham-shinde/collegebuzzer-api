import { Students, Branchs, Guests } from '../../mongoose/mongoosConfig';
import sendSetPasswordMail from '../../services/mailService';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET, SERVER_URL, ROLES } from '../../appconfig';

export default {
    post : _post
}

function _post (req, res, next) {
    req.checkBody("name", 'invalid credentials').isValidName()
    req.checkBody("mail", 'invalid credentials').isEmail()

    var errors = req.validationErrors();

    if (errors) {
        res.status(406)
        res.json({
            error: errors,
            msg: 'check your form there must be some fault',
            status: false,
            code: 406
        });
        return;
    }
    
    else {
        Guests.findOne({ mail: req.body.mail }).exec((err, doc) => {
            if(err)
                return next(err)
            if(!doc) {
                const token = jwt.sign(
                    { mail: req.body.mail , },
                    SESSION_SECRET
                );
                const link = SERVER_URL+'/setpassword/guest/'+token.toString()
        
                const newStuString = 'student'+token
        
                req.store.hmset(newStuString,{
                    ...req.body
                    },
                    function (err, redisRes) {
                        if (err) {
                            return next(err);
                        }
                        req.store.expire(newStuString, 60*30)
                        sendSetPasswordMail({to: req.body.mail, link});
                        res.status(200);
                        return res.json({
                            msg: `Link has been send on provided Email.
                            Open it within half an hour to set password and complete registration.`,
                            status: true,
                            status: 200
                        });
                    }
                );
            }
            else {
                res.status(404)
                res.json({
                    msg: 'Email id already exists',
                    show_msg: {
                        h : 'Error',
                        msg : "Your mail is already registerd"
                    },
                    status: false,
                    status: 404
                })
            }
        })
    }       
}