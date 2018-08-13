import { Confessions } from '../../mongoose/mongoosConfig';

export default {
    get : _get,
    get2 : _get2
}

function _get (req, res, next) {
    const _id = req.params._id;
    console.log(_id)
    if(_id !== '0') {
        const allPosts = Confessions.find({ is_auth: true }).where('_id').lt(_id)
        allPosts.limit(10).sort({_di: -1})
        allPosts.exec((err, posts) => {
            if(err)
                next(err);
            
            res.status(200)
            res.json({
                msg: "your 10 Confessions",
                status: true,
                code: 204,
                posts
            })
        }) 
    }
    else {
        const allPosts = Confessions.find({ is_auth: true })
        allPosts.sort({_id: -1}).limit(10)
        allPosts.exec((err, posts) => {
            if(err)
                next(err);
            
            res.status(200)
            res.json({
                msg: "your 10 Confessions",
                status: true,
                code: 204,
                posts
            })  
        }) 
    }
    
}

function _get2 (req, res, next) {
    const _id = req.params._id;
    console.log(_id)
    if(_id !== '0') {
        const allPosts = Confessions.find().where('_id').lt(_id)
        allPosts.limit(10).sort({_di: -1})
        allPosts.exec((err, posts) => {
            if(err)
                next(err);
            
            res.status(200)
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
        allPosts.sort({_id: -1}).limit(10)
        allPosts.exec((err, posts) => {
            if(err)
                next(err);
            
            res.status(200)
            res.json({
                msg: "your 10 Confessions",
                status: true,
                code: 204,
                posts
            })  
        }) 
    }
    
}