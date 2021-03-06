import { Clubs } from '../../mongoose/mongoosConfig';
import sendSetPasswordMail from '../../services/mailService';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET, SERVER_URL, ROLES } from '../../appconfig';

export default {
    post : _post
}

function _post (req, res, next) {
    console.log("got a post request to register")
    req.checkBody("name", 'invalid credentials')
    req.checkBody("heads", 'invalid credentials')
    req.checkBody("mail", 'invalid credentials').isEmail()

    var errors = req.validationErrors();

    if (errors) {
        res.status(406)
        res.json({
            error: errors,
            status: false,
            code: 406
        });
        return;
    }
    else if (req.session.role === ROLES[2]) {
        Clubs.findOne({ mail: req.body.mail }).exec((err, doc) => {
            if(err)
                return next(err)
            if(!doc) {
                const token = jwt.sign(
                    { mail: req.body.mail },
                    SESSION_SECRET
                );
                const link = SERVER_URL+'/setpassword/club/'+token.toString()
        
                const newStuString = 'student'+token
                console.log({...req.body})
                req.store.hmset(newStuString,{
                    ...req.body
                    },
                    function (err, redisRes) {
                        if (err) {
                            return next(err);
                        }
                        req.store.expire(newStuString, 60*120)
                        sendSetPasswordMail({to: req.body.mail, link});
                        res.status(200);
                        return res.json({
                            msg: 'link has been send',
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
                    status: false,
                    status: 404
                })
            }
        })
    } 
    else {
        res.status(404)
        res.json({
            msg: 'you are not allowed to add club',
            status: false,
            status: 404
        })
    }      
}