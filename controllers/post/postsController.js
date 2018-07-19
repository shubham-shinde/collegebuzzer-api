import { Posts } from '../../mongoose/mongoosConfig';

export default {
    get : _get
}

function _get (req, res) {
    const page = req.params.page;
    const allPosts = Posts.find();
    allPosts.exec((err, posts) => {
        if(err)
            next(err);
        console.log(posts);
        res.send(posts);   
    }) 
}