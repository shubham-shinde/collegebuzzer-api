import { Students, Branchs } from '../../mongoose/mongoosConfig';
import sendSetPasswordMail from '../../services/mailService';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET, SERVER_URL, ROLES } from '../../appconfig';

export default {
    post : _post
}

function _post (req, res, next) {
    console.log("got a post request to register")
    req.checkBody("year", 'invalid credentials').isInt({min: 0, max: 4})
    req.checkBody("type", 'invalid credentials').isUppercase().isLength(1).isIn(['R','L','B'])
    req.checkBody("section", 'invalid credentials').isUppercase().isLength(1).isIn(['A','B'])
    req.checkBody("rollno", 'invalid credentials').isNumeric().isLength(10)
    req.checkBody("branch", 'invalid credentials').isLength(2)
    req.checkBody("gender", 'invalid credentials').isUppercase().isLength(1).isIn(['M','F'])
    req.checkBody("f_name", 'invalid credentials').isAlpha()
    req.checkBody("l_name", 'invalid credentials').isAlpha()
    req.checkBody("b_year", 'invalid credentials').isInt({min: 1990, max: 2010})
    req.checkBody("b_date", 'invalid credentials').isInt({min: 0, max: 31})
    req.checkBody("b_month", 'invalid credentials').isInt({min: 0, max: 11})
    req.checkBody("m_no", 'invalid credentials').isMobilePhone('en-IN')
    req.checkBody("mail", 'invalid credentials').isEmail()
    req.checkBody("h_town", 'invalid credentials').isAlpha() 

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
    else {
        Students.findOne({ mail: req.body.mail }).exec((err, doc) => {
            if(err)
                return next(err)
            if(!doc) {
                const token = jwt.sign(
                    { mail: req.body.mail, branch: req.body.branch, year: req.body.year },
                    SESSION_SECRET
                );
                const link = SERVER_URL+'/setpassword/'+token.toString()
        
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
}