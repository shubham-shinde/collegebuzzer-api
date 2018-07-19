import { Posts } from '../../mongoose/mongoosConfig';

export default {
    put : _put
}

function _put (req, res) {
    const data = req.body
    console.log(data);
    const liked_userID = data.userID;
    const post_id = data.id;
    Posts.findOneAndUpdate({id : post_id}, {
        "$inc": { likes : 1 },
        "$push": { liked_by : liked_userID }
    }).exec((err, post) => {
        if(err)
            next(err);
        res.send("You liked post of id:: " + post.id)
    })
    
}