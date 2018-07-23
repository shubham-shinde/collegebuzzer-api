import { Confessions } from '../../mongoose/mongoosConfig';

export default {
    post : _post
}

function _post (req, res) {
    const _id = req.params._id;
    console.log(_id)
    if(_id !== '0') {
        const allPosts = Confessions.find().where('_id').lt(_id)
        allPosts.limit(10).sort('-date')
        allPosts.exec((err, posts) => {
            if(err)
                next(err);
            
            res.json({
                msg: "your 10 Confessions",
                status: true,
                code: 204,
                posts
            })
        }) 
    }
    else {
        const allPosts = Confessions.find()
        allPosts.sort('-date').limit(10)
        allPosts.exec((err, posts) => {
            if(err)
                next(err);
            

            res.json({
                msg: "your 10 Confessions",
                status: true,
                code: 204,
                posts
            })  
        }) 
    }
    
}