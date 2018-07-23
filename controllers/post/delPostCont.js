import { Posts, Students, Clubs } from '../../mongoose/mongoosConfig';
import { ROLES } from '../../appconfig.js'

export default {
    post : _post
}

function _post (req, res, next) {
    const post_data = req.body;

    if(req.session.Id === req.body.Id) {
        Posts.findOne({_id: req.body.Id}).exec((err, doc) => {
            if(doc) {
                doc.remove((err, post) => {
                    if(err){
                        next(err);
                    }
                    if(ROLES[0] === req.session.role) {
                        Students.findOne({_id : req.session.Id}).exec((err, stu) => {
                            stu.h_post.splice( stu.h_post.indexOf(post._id), 1 );
                            stu.save((err) => {
                                if(err){
                                    next(err);
                                }
                                res.status(204)
                                res.json({
                                    msg: 'post is removed',
                                    status: true,
                                    code: 204
                                })
                            })
                        })
                    }
                    else if (ROLES[1] === req.session.role) {
                        Clubs.findOne({_id : req.session.Id}).exec((err, stu) => {
                            stu.h_post.splice( stu.h_post.indexOf(post._id), 1 );
                            stu.save((err) => {
                                if(err){
                                    next(err);
                                }
                                res.status(204)
                                res.json({
                                    msg: 'post is removed',
                                    status: true,
                                    code: 204
                                })
                            })
                        })
                    }
                }) 
            }
        })
    }

    
    else {
        res.status(400)
        res.json({
            msg: 'you are not allowed to remove this posts',
            status: false,
            code: 400
        })
    }          
}