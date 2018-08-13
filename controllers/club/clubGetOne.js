import { Clubs } from '../../mongoose/mongoosConfig';

export default {
    get : _get
}

function _get (req, res) {
    const _id = req.params._id;
    console.log(_id)
    Clubs.findOne({_id}).exec((err, club) => {
        if(err) {
            next(err)
        }
        console.log(club)

        // const posts = club.h_posts.map((postf) => {
        //     const pics = createPicLink(postf.n_pics, postf._id)
        //     return { post:postf, pics}
        // })

        const send_stu = {
            name : club.name,
            theme : club.theme,
            p_pic : club.p_pic,
            bio : club.bio,
            h_post : club.h_posts
        }
        res.status(200)
        res.json({
            msg : 'this is awesome',
            status: true,
            code: 200,
            club: send_stu
        })
    })    
}

function createPicLink(no, id) {
    const pics = []
    for(var i=0; i< no; i++) {
        pics.push({
            pre: AWS_S3_LINK+'posts/'+id+i+'pre'+'.jpg',
            pic: AWS_S3_LINK+'posts/'+id+i+'.jpg'
        })
    }
    return pics;
} 