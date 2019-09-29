import { CLUB_POSTS } from '../../mongoose/mongoosConfig';
import { AWS_S3_LINK } from '../../appconfig';

export default {
    get : _get
}

function _get (req, res, next) {
    const _id = req.params._id;
    console.log(_id)
    if(_id !== '0') {
        const allPosts = CLUB_POSTS.find({is_auth : true }).where('_id').lt(_id)
        allPosts.limit(10).sort({_id: -1})
        allPosts.exec().then((posts) => {
            const postToSent = posts.map((postf) => {
                const pics = createPicLink(postf.n_pics, postf.n_videos, postf._id)
                const time = postf._id.getTimestamp().toLocaleString("en-IN", { timeZone: 'Asia/Kolkata' })
                return {post:postf, pics, role: 'club',time}
            })
            res.json({
                msg: "your 10 posts",
                status: true,
                code: 204,
                posts : postToSent
            })
        }).catch((err) => {
            if(err)
                next(err);
        })
    }
    else {
        const allPosts = CLUB_POSTS.find()
        allPosts.sort({_id: -1}).limit(10)
        const p_promise = allPosts.exec()
        p_promise.then((posts) => {
            const postToSent = posts.map((postf) => {
                const pics = createPicLink(postf.n_pics, postf.n_videos, postf._id)
                const time = postf._id.getTimestamp().toLocaleString("en-IN", { timeZone: 'Asia/Kolkata' })
                return {post: postf, pics, time, role: 'club'} 
            })
            res.json({
                msg: "your 10 posts",
                status: true,
                code: 204,
                posts: postToSent
            })  
        }).catch((err) => {
            if(err)
                next(err);
        })
    }    
}
function createPicLink(no, vi, id) {
    const pics = []
    const videos = vi ? vi : 0
    for(var i=0; i< no-videos; i++) {
        pics.push({
            pre: AWS_S3_LINK+'posts/'+id+i+'pre'+'.jpg',
            pic: AWS_S3_LINK+'posts/'+id+i+'.jpg',
            type: 'pic'
        })
    }
    for (i=no-videos; i< no; i++) {
        pics.push({
            vid: AWS_S3_LINK+'posts/'+id+i+'.mp4',
            type : 'video'
        })
    }
    return pics;
} 