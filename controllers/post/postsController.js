import { Posts } from '../../mongoose/mongoosConfig';
import { AWS_S3_LINK } from '../../appconfig';

export default {
    post : _post
}

function _post (req, res) {
    const _id = req.params._id;
    console.log(_id)
    if(_id !== '0') {
        const allPosts = Posts.find().where('_id').lt(_id)
        allPosts.limit(10).sort('-date')
        allPosts.exec((err, posts) => {
            if(err)
                next(err);
            posts.map((post) => {

            })
            res.json({
                msg: "your 10 posts",
                status: true,
                code: 204,
                posts
            })
        }) 
    }
    else {
        const allPosts = Posts.find()
        allPosts.sort('-date').limit(10)
        allPosts.exec((err, posts) => {
            if(err)
                next(err);
            
            const postToSent = posts.map((postf) => {
                const pics = createPicLink(postf.n_pics, postf._id)
                return {...postf, pics}
            })
            res.json({
                msg: "your 10 posts",
                status: true,
                code: 204,
                postToSent
            })  
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