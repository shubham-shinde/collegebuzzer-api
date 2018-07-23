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
        "$push": { liked_by : req.session.Id }
    }).exec((err, post) => {
        if(err){
            next(err);
        }
        res.status(204)
        res.json({
            msg: 'you liked post',
            status: true,
            code: 204
        })
    })
    
}