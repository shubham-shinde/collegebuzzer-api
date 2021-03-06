import { Students, Branchs, Guests } from '../../mongoose/mongoosConfig';
import jwt from 'jsonwebtoken';
import bycrpt from 'bcryptjs';
import { SESSION_SECRET } from '../../appconfig';
import path from 'path';

export default {
    get : _get,
    post : _post
}

function _get(req, res) {
    const token = req.params.who;
    
    jwt.verify(token,SESSION_SECRET, (err, data) => {
        console.log(err);
        if(err) {
            res.json({
                msg: 'you don\'t have permition',
                status: false
            })
        }
        else {
            req.store.hgetall('student'+token,(err, data)=> {
                if(data) {
                    res.render(path.join(__dirname,'..','..','static','setpassword.html'))
                }
                else {
                    res.send('Your registration session is expired register again to create account')
                }
            })
        }
    })
}


function _post (req, res, next) {
    
    req.checkBody('password', 'wrong credential').isLength({min: 6, max: 15})
    console.log(req.params);

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
        req.store.hgetall('student'+req.params.who,(err, student_data) => {
            if(err) {
                next(err);
            }
            if(student_data) {
                if(!student_data.exist || student_data.exist === undefined) {
                    
                console.log(student_data);
                const password = bycrpt.hashSync(req.body.password,4);
                const name = student_data.name
                const mail = student_data.mail
                const is_auth = true;
            
                    const new_student = Guests({
                        is_auth, password, 
                        name, mail,
                    })
            
            
                    new_student.save((err) => {
                        if(err)
                            next(err);       
                    })

                    req.store.del('student'+req.params.who)
                    res.status(201)
                    res.json({
                        msg: "your password is saved",
                        status: true,
                        code: 201
                    })       
                }
            }
            else {
                Guests.find({ mail: student_data.mail}).exec((err, doc) => {
                    if(err) {
                        next(err)
                    }
                    if(doc) {
                        doc.password = bycrpt.hashSync(req.body.password,4)
                    }
                    req.status(204)
                    res.json({
                        msg: "your password is saved",
                        status: true,
                        code: 204
                    })
                })
            }
        })
    }       
}