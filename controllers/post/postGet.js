import { Posts, STU_POSTS, CLUB_POSTS } from '../../mongoose/mongoosConfig';
import { AWS_S3_LINK, ROLES } from '../../appconfig';

export default {
    post : _post
}

function _post (req, res, next) {
    const array = req.body.ids;
    const role = req.body.role;
    let allPosts;
    if(!array) {
        res.json({
            msg: "give array of ids ids = array & role of the profile",
            status: false,
            code: 400,
        })
    }
    // if(_id !== '0') {
    if(role === ROLES[0]) {
        allPosts = STU_POSTS.find({
            '_id': { 
                $in: [
                    ...array
                ]
            }
        })
    }
    else if( role === ROLES[1]) {
        allPosts = CLUB_POSTS.find({
            '_id': { 
                $in: [
                    ...array
                ]
            }
        })
    }
    else {
        status(400)
        return res.json({
            msg: "give array of ids ids = array & role of the profile",
            status: false,
            code: 400,
        })
    }

        allPosts.sort({_id: -1})
        allPosts.exec().then((posts) => {
            const postToSent = posts.map((postf) => {
                const pics = createPicLink(postf.n_pics, postf._id)
                return {post:postf, pics}
            })
            res.json({
                msg: "your posts",
                status: true,
                code: 204,
                posts : postToSent
            })
        }).catch((err) => {
            if(err)
                next(err);
        })
    // }
    // else {
    //     const allPosts = Posts.find()
    //     allPosts.sort('-date').limit(10)
    //     const p_promise = allPosts.exec()
    //     p_promise.then((posts) => {
    //         const postToSent = posts.map((postf) => {
    //             const pics = createPicLink(postf.n_pics, postf._id)
    //             postf.pics = pics
    //             return {post: postf, pics} 
    //         })
    //         res.json({
    //             msg: "your 10 posts",
    //             status: true,
    //             code: 204,
    //             posts: postToSent
    //         })  
    //     }).catch((err) => {
    //         if(err)
    //             next(err);
    //     })
    // }    
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