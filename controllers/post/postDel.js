import { Posts, Students, Clubs, STU_POSTS, CLUB_POSTS } from '../../mongoose/mongoosConfig';
import { ROLES } from '../../appconfig.js'

export default {
    get : _get
}

function _get (req, res, next) {
    const _id = req.params._id;
        if(ROLES[1] === req.session.role) {            
            CLUB_POSTS.findOne({_id: _id}).exec((err, doc) => {
            if(doc && doc.Id == req.session.Id ) {
                doc.remove((err, post) => {
                    if(err){
                        next(err);
                    }                    
                    Clubs.findOne({_id : req.session.Id}).exec((err, stu) => {
                            stu.h_posts.splice( stu.h_posts.indexOf(post._id), 1 );
                            stu.save((err) => {
                                if(err){
                                    next(err);
                                }
                                console.log('deleted post')
                                res.status(200)
                                res.json({
                                    msg: 'post is removed',
                                    status: true,
                                    code: 204
                                })
                            })
                    })
                }) 
            }
            else {
                res.status(404)
                res.json({
                    msg: 'post is not available',
                    status: false,
                    code: 404
                })
            }
            })
        }
        if(ROLES[0] === req.session.role) {
            STU_POSTS.findOne({_id: _id}).exec((err, doc) => {
                if(doc && doc.Id == req.session.Id) {
                    doc.remove((err, post) => {
                        if(err){
                            next(err);
                        }

                        Students.findOne({_id : req.session.Id}).exec((err, stu) => {
                                
                                if( !stu || stu === undefined || stu === null ) {
                                    res.status(406)
                                    return res.json({
                                        msg: 'problem in finding student',
                                        stutus: false,
                                        code: 406
                                    })
                                }
                                stu.h_posts.splice( stu.h_posts.indexOf(post._id), 1 );
                                stu.save((err) => {
                                    if(err){
                                        next(err);
                                    }
                                    res.status(200)
                                    res.json({
                                        msg: 'post is removed',
                                        status: true,
                                        code: 204
                                    })
                                })
                        })
                    }) 
                }
                else {
                    res.status(404)
                    res.json({
                        msg: 'post is not available',
                        status: false,
                        code: 404
                    })
                }
            })
    }

    
    // else {
    //     res.status(400)
    //     res.json({
    //         msg: 'you are not allowed to remove this posts',
    //         status: false,
    //         code: 400
    //     })
    // }          
}