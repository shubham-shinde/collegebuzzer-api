import { Students, Branchs } from '../mongoose/mongoosConfig';
import jwt from 'jsonwebtoken';
import bycrpt from 'bcryptjs'
import { SESSION_SECRET } from '../appconfig';
import path from 'path'

export default {
    get : _get,
    post : _post
}


function _get(req, res) {
    const token = req.params.who;
    
    res.render(path.join(__dirname,'..','static','setpassword.html'))
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
                
            })
        }
    })
}


function _post (req, res, next) {
    
    req.checkBody('password', 'wrong credential').isLength({min: 6, max: 15})

    var errors = req.validationErrors();

    if (errors) {
        res.json({error: errors});
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
                const year = Number(student_data.year)
                const type = student_data.type  //reguler, leteral , or branchChange
                const section = student_data.section
                const rollno = student_data.rollno
                const branch = student_data.branch
                const gender = student_data.gender
                const f_name = student_data.f_name
                const m_name = ( !student_data.m_name || student_data.m_name !=='undefined') ? null : student_data.m_name;
                const l_name = student_data.l_name
                const dob = new Date(student_data.dob)
                const m_no = student_data.m_no
                const mail = student_data.mail
                const h_town = student_data.h_town
                const userIntro = create_user_intro(year, branch);
                const is_auth = false;
                
                
            
                const branch_query = Branchs.where({ year: find_year(year)-2000, name: branch });
                
                branch_query.findOne().exec((err, doc) => {
                    if(err) 
                        next(err);
            
                    console.log(doc);
                    const section_no = (section === "A") ? doc.no_A+1 : doc.no_B+1;
                    const userID = create_userId(year,type, branch, section, section_no)
            
                    const new_student = Students({
                        rollno, h_town, userIntro, is_auth, password, h_post : [], userID, gender, 
                        f_name, m_name, l_name, branch, mail, m_no, dob,
                        year : find_year(year) - 2000,
                        self: userIntro,
                        created_at : Date.now(),
                    })
            
            
                    new_student.save((err) => {
                        if(err)
                            next(err);       
                    })
                    
                    doc.t_stu = doc.t_stu + 1;            
                    
                    if(section === "A") {
                        doc.no_A = doc.no_A +1;
                        doc.A.push(new_student._id);
                    }
                    else {
                        doc.no_B = doc.no_B +1;
                        doc.B.push(new_student._id);
                    }
            
                    doc.save((err) => {
                        if(err)
                            next(err);  

                        req.store.del('student'+req.params.who)

                        res.json({
                            msg: "your password is saved",
                            status: true
                        })
            
                        // const token = jwt.sign(
                        //     { id: new_student._id, role: "student" },
                        //     SESSION_SECRET
                        // );
            
                        // const sessionString = "fucked_up_students"+new_student._id ;
            
                        // req.store.hmset(sessionString,{
                        //     ...req.body
                        // },
                        //     function (err, redisRes) {
                        //         if (err) {
                        //             return next(err);
                        //         }
                        //         req.store.expire(sessionString, 30);
                        //         console.log("redis res", redisRes);
                        //         res.status(200);
                        //         return res.json({
                        //             msg: "Student data is saved",
                        //             status: true
                        //         });
                        //     }
                        // );
                    });        
                });
                }
            }
            else {
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
                            res.json({
                                msg: "your password is saved",
                                status: true
                            })
                        }
                    })
                })
            }
            

        })
    }       
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