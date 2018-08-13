import { Posts, STU_POSTS, CLUB_POSTS } from '../../mongoose/mongoosConfig';
import { ROLES } from '../../appconfig';

export default {
    post : _post
}

function _post (req, res, next) {
    const post_id = req.body._id;
    const writer = req.body.writer;
    if(writer === ROLES[0]) {
        STU_POSTS.findOne({_id : post_id}).exec((err, post) => {
            if(err){
                return next(err);
            }
            if(post.likes.indexOf(req.session.Id) > -1) {            
                post.likes.splice( post.likes.indexOf(req.session.Id), 1 );            
                res.status(200)
                res.json({
                    msg: 'you unliked post',
                    status: true,
                    code: 204
                })
            }
            else {
                post.likes.push(req.session.Id);
                res.status(200)
                res.json({
                    msg: 'you liked post',
                    status: true,
                    code: 204
                })
            }
            post.save((err) => {
                if(err) {
                    return next(err)
                }
            })
        })
    }
    else if (writer === ROLES[1]) {
        CLUB_POSTS.findOne({_id : post_id}).exec((err, post) => {
            if(err){
                return next(err);
            }
            if(post.likes.indexOf(req.session.Id) > -1) {            
                post.likes.splice( post.likes.indexOf(req.session.Id), 1 );            
                res.status(200)
                res.json({
                    msg: 'you unliked post',
                    status: true,
                    code: 204
                })
            }
            else {
                post.likes.push(req.session.Id);
                res.status(200)
                res.json({
                    msg: 'you liked post',
                    status: true,
                    code: 204
                })
            }
            post.save((err) => {
                if(err) {
                    return next(err)
                }
            })
        })
    }
}