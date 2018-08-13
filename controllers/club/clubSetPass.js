import { Clubs, Students } from '../../mongoose/mongoosConfig';
import jwt from 'jsonwebtoken';
import bycrpt from 'bcryptjs';
import { SESSION_SECRET, AWS_S3_LINK } from '../../appconfig';
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
            res.status(401)
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
                    res.send('Your registration is expired register again to create account')
                }
            })
        }
    })
}


function _post (req, res, next) {
    
    req.checkBody('password', 'wrong credential').isLength({min: 6, max: 15})

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
        console.log(req.params.who)
        req.store.hgetall('student'+req.params.who,(err, student_data) => {
            if(err) {
                next(err);
            }
            if(student_data) {
                if(!student_data.exist || student_data.exist === undefined) {

                    const password = bycrpt.hashSync(req.body.password,4);
                    
                    const heads_id = student_data.heads.split(',');

                    Students.find({
                        '_id': {
                            $in: [
                                ...heads_id
                            ]
                        }
                    }).exec((err, data) => {
                        if(err) {
                            next(err);
                        }
                        if(!data || data.length !== heads_id.length ) {
                            res.status(400)
                            res.json({
                                msg: "There must be some problem in heads section",
                                status: true,
                                code: 400
                            })
                        }
                        else {
                            const heads = extract_students(data)
            
                            const new_student = Clubs({
                                name : student_data.name,
                                mail : student_data.mail,
                                bio : 'WE ARE THE BEST IN THE COLLAGE',
                                password,
                                heads,
                                is_auth : true,
                                h_posts : []
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
                    }) 
                }
            }
            else if (!student_data) {
                res.status(401)
                return res.json({
                    msg: "your link is expired or there is some problem",
                    status: true,
                    code: 401
                })
            }
        })
    }       
}

const extract_students = (data) => {
    return data.map((head) => {
        const p_pic = AWS_S3_LINK+'profile/'+head._id+'.jpg'
        return {
            Id : head._id,
            p_pic : p_pic,
            name : head.name,
            userIntro : head.userIntro
        }
    })
}