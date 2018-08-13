import { Posts, STU_POSTS } from '../../mongoose/mongoosConfig';
import { AWS_S3_LINK } from '../../appconfig';

export default {
    get : _get
}

function _get (req, res, next) {
    const _id = req.params._id;
    console.log(_id)
    if(_id !== '0') {
        const allPosts = STU_POSTS.find({is_auth : true }).where('_id').lt(_id)
        allPosts.limit(10).sort({_id: -1})
        allPosts.exec().then((posts) => {
            const postToSent = posts.map((postf) => {
                const pics = createPicLink(postf.n_pics, postf._id)
                const time = postf._id.getTimestamp().toLocaleString("en-IN")
                return {post:postf, pics, time}
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
        const allPosts = STU_POSTS.find()
        allPosts.sort({_id: -1}).limit(10)
        const p_promise = allPosts.exec()
        p_promise.then((posts) => {
            const postToSent = posts.map((postf) => {
                const pics = createPicLink(postf.n_pics, postf._id)
                postf.pics = pics
                const time = postf._id.getTimestamp().toLocaleString("en-IN")
                return {post: postf, pics, time} 
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