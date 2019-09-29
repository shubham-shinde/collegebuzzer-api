import { Students, Branchs } from '../../mongoose/mongoosConfig';
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
                    res.send('Your registration is expired register again to create account')
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
                    const password = bycrpt.hashSync(req.body.password,4);
                    const year = Number(student_data.year)
                    const sec = student_data.sec
                    const clgId = student_data.clgId
                    const branch = student_data.branch
                    const gen = student_data.gen
                    const name = student_data.name
                    const dob = student_data.dob
                    const mail = student_data.mail
                    const userIntro = create_user_intro(year, branch);
                    const is_auth = true;
                
                    const new_student = Students({
                        clgId, userIntro, sec, is_auth, password, h_post : [], gen,
                        name, branch, mail, dob,
                        year : find_year(year) - 2000,
                        bio: CreateBio(dob, branch, gen, year),
                        created_at : Date.now(),
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
            else if(student_data.exist === true ) {
                Students.find({ mail: student_data.mail}).exec((err, doc) => {
                    if(err) {
                        next(err)
                    }
                    if(doc) {
                        doc.password = bycrpt.hashSync(req.body.password,4)
                    }
                    doc.save((err) => {
                        if(err) {
                            next(err)
                        }
                        else {
                            req.store.del('student'+req.params.who)

                            req.status(204)
                            res.json({
                                msg: "your password is saved",
                                status: true,
                                code: 204
                            })
                        }
                    })
                })
            } 
            else {
                res.status(500);
                res.json({
                    msg: 'There must be some problem'
                })
            }           

        })
    }       
}

function CreateBio(dob, branch, gen, year) {
    const date = new Date(dob);
    const dateString = date.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})
    return `I JUST WANT TO GRADUATE
    Wish me on ${dateString}`
}

function create_user_intro(year, branch) {
    let stu_branch = branch;
    if(branch === 'E3') {
        stu_branch = "EEE"
    }
    let user_intro;
    switch (year) {
        case 1: {
            user_intro = ""+year+"st year "+stu_branch;
            break;
        }
        case 2: {
            user_intro = ""+year+"nd year "+stu_branch;
            break;
        } 
        case 3: {
            user_intro = ""+year+"rd year "+stu_branch;
            break;
        } 
        case 4: {
            user_intro = ""+year+"th year "+stu_branch;
            break;
        }         
    }
    return user_intro;
}

function create_userId(year,type, branch, section, roll_no) { // 16RITB01
    const type_string = type;
    const year_string = find_year(year);
    const branch_string = branch;
    const section_string = section;
    const roll_no_string = (roll_no < 10) ? "0"+roll_no: roll_no;
    return ""+(year_string - 2000) + type_string + branch_string + section_string + roll_no_string;
}

function find_year(year) {
    const Date_now = new Date()
    let year_of_add;
    if(Date_now.getMonth() > 4) {
        year_of_add = Date_now.getFullYear() - year +1;
    }
    else {
        year_of_add = Date_now.getFullYear() - year;
    }
    return year_of_add;
}