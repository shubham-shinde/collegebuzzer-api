import { Clubs, Admins, Students, Guests } from '../../mongoose/mongoosConfig';
import { ROLES, AWS_S3_LINK } from '../../appconfig';

export default {
    get : _get
}

function _get (req, res, next) {
    console.log(req.session)
    if (req.session.role === ROLES[0]) {
        Students.findOne({_id : req.session.Id }).exec((err, student) => {
            if(err) {
                next(err)
            }
            if(!student) {
                res.status(400)
                return res.json({
                    msg : 'student is not available',
                    status: true,
                    code: 400
                })
            }

            Clubs.find({}).exec((err, clubs) => {
                const NamesAndIds = clubs.map((data) => {
                    let p_pic = data.p_pic
                    // if(!data.p_pic) {
                    //     p_pic = AWS_S3_LINK+'profile/'+data._id+'.jpg'
                    // }
                    return {
                        _id: data._id,
                        name: data.name,
                        heads : data.heads,
                        theme: data.theme,
                        bio: data.bio,
                        p_pic
                    }
                })

                const send_stu = {
                    _id : student._id,
                    name : student.name,
                    theme: student.theme,
                    clubs : NamesAndIds,
                    role: req.session.role,
                    bio: student.bio,
                    p_pic : student.p_pic,
                    userIntro : student.userIntro,
                }
                res.status(200)
                res.json({
                    msg : 'data is send',
                    status: true,
                    code: 200,
                    basic: send_stu
                })
            })

            // const posts = student.h_posts.map((postf) => {
            //     const pics = createPicLink(postf.n_pics, postf._id)
            //     return {...postf, pics}
            // })

            
        })    
    }
    else if (req.session.role === ROLES[1]) {
        Clubs.findOne({_id : req.session.Id }).exec((err, student) => {
            if(err) {
                next(err)
            }
            console.log(student)
            if(!student) {
                res.status(400)
                return res.json({
                    msg : 'student is not available',
                    status: true,
                    code: 400
                })
            }

            Clubs.find({}).exec((err, clubs) => {
                const NamesAndIds = clubs.map((data) => {
                    let p_pic = data.p_pic
                    // if(!data.p_pic) {
                        // p_pic = AWS_S3_LINK+'profile/'+data._id+'.jpg'
                    // }
                    return {
                        _id: data._id,
                        name: data.name,
                        theme: data.theme,
                        heads: data.heads,
                        bio: data.bio,
                        p_pic
                    }
                })

                const send_stu = {
                    _id : student._id,
                    name : student.name,
                    theme : student.theme,
                    bio: student.bio,
                    heads : student.heads,
                    role : req.session.role,
                    clubs : NamesAndIds,
                    p_pic : student.p_pic,
                    userIntro : student.userIntro,
                }
                res.status(200)
                res.json({
                    msg : 'data is send',
                    status: true,
                    code: 200,
                    basic : send_stu
                })
            })

            // const posts = student.h_posts.map((postf) => {
            //     const pics = createPicLink(postf.n_pics, postf._id)
            //     return {...postf, pics}
            // })

            
        }) 
    }
    else if (req.session.role === ROLES[3]) {
        Guests.findOne({_id : req.session.Id }).exec((err, student) => {
            if(err) {
                next(err)
            }
            console.log(student)
            if(!student) {
                res.status(400)
                return res.json({
                    msg : 'student is not available',
                    status: true,
                    code: 400
                })
            }

            Clubs.find({}).exec((err, clubs) => {
                const NamesAndIds = clubs.map((data) => {
                    let p_pic = data.p_pic
                    return {
                        _id: data._id,
                        name: data.name,
                        theme: data.theme,
                        heads: data.heads,
                        bio: data.bio,
                        p_pic
                    }
                })

                const send_stu = {
                    _id : student._id,
                    name : student.name,
                    role : req.session.role,
                    clubs : NamesAndIds,
                }
                res.status(200)
                res.json({
                    msg : 'data is send',
                    status: true,
                    code: 200,
                    basic : send_stu
                })
            })
        }) 
    }
    else if (req.session.role === ROLES[2]) {
        Admins.findOne({_id : req.session.Id }).exec((err, student) => {
            if(err) {
                next(err)
            }
            console.log(student)
            if(!student) {
                res.status(400)
                return res.json({
                    msg : 'student is not available',
                    status: true,
                    code: 400
                })
            }

            Clubs.find({}).exec((err, clubs) => {
                const NamesAndIds = clubs.map((data) => {
                    let p_pic = data.p_pic
                    // if(!data.p_pic) {
                    //     p_pic = AWS_S3_LINK+'profile/'+data._id+'.jpg'
                    // }
                    return {
                        _id: data._id,
                        name: data.name,
                        theme: data.theme,
                        heads: data.heads,
                        bio: data.bio,
                        p_pic
                    }
                })

                const send_stu = {
                    _id : student._id,
                    name : student.name,
                    role: req.session.role,
                    theme: student.theme,
                    clubs : NamesAndIds,
                    p_pic : student.p_pic,
                    userIntro : student.userIntro,
                }
                res.status(200)
                res.json({
                    msg : 'data is send',
                    status: true,
                    code: 200,
                    basic: send_stu
                })
            })

            // const posts = student.h_posts.map((postf) => {
            //     const pics = createPicLink(postf.n_pics, postf._id)
            //     return {...postf, pics}
            // })

            
        }) 
    }
}

function createPicLink(no, id) {
    const pics = []
    for(var i=0; i< no; i++) {
        pics.push({
            pre: AWS_S3_LINK+'posts/'+id+'pre'+'.jpg',
            pic: AWS_S3_LINK+'posts/'+id+'.jpg'
        })
    }
    return pics;
} 

function filterClubInfo(clubs) {
    const filtered = clubs.map((club) => {
        return {
            name : club.name,
            p_pic : club.p_pic,
            _id : club._id            
        }
    })
}