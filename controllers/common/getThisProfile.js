import { Students, Clubs } from '../../mongoose/mongoosConfig';

export default {
    get : _get
}

function _get (req, res, next) {
    const _id = req.params._id;
    console.log(_id)
    Students.findOne({_id}).exec((err, student) => {
        if(err) {
            next(err)
        }
        console.log(student)
        if(!student) {
            Clubs.findOne({_id}).exec((err, club) => {
                if(err) {
                    next(err)
                }
                if(!club) {
                    res.status(400)
                    return res.json({
                        msg : 'no profile with this id',
                        status: false,
                        code: 404
                    })
                }
                
        
                const send_stu = {
                    _id : club._id,
                    name : club.name,
                    theme : club.theme,
                    p_pic : club.p_pic,
                    heads : club.heads,
                    bio : club.bio,
                    h_posts : club.h_posts,
                    role: 'club'
                }
                res.status(200)
                res.json({
                    msg : 'this is awesome',
                    status: true,
                    code: 200,
                    profile: send_stu
                })
            })    
        }

        // const posts = student.h_posts.map((postf) => {
        //     const pics = createPicLink(postf.n_pics, postf._id)
        //     return {...postf, pics}
        // })
        else {
            const send_stu = {
                _id : student._id,
                name : student.name,
                theme : student.theme,
                p_pic : student.p_pic,
                userIntro : student.userIntro,
                bio : student.bio,
                h_posts : student.h_posts,
                role : 'student'
            }
            res.status(200)
            res.json({
                msg : 'this is awesome',
                status: true,
                code: 200,
                profile: send_stu
            })
        }
        
    })    
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