import { Clubs } from '../../mongoose/mongoosConfig';

export default {
    get : _get
}

function _get (req, res) {
    Clubs.find({}).exec((err, club) => {
        if(err) {
            next(err)
        }

        // const posts = club.h_posts.map((postf) => {
        //     const pics = createPicLink(postf.n_pics, postf._id)
        //     return { post:postf, pics}
        // })

        const send_stu = club.map((data) => {
            return {
                _id: data._id,
                name: data.name,
                p_pic : data.p_pic
            }
        })
        res.status(200)
        res.json({
            msg : 'this is awesome',
            status: true,
            code: 200,
            clubs: send_stu
        })
    })    
}