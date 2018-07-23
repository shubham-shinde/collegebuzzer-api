import { Clubs } from '../../mongoose/mongoosConfig';
import { ROLES } from '../../appconfig.js'

export default {
    post : _post
}

function _post (req, res, next) {
    const post_data = req.body;

    if(req.session.role === ROLES[0]) {    
        const new_post = Clubs({
            text : post_data.text,
            theme : post_data.theme,
            time : Date.now(),
            year : session.year,
            branch : session.branch,
            is_auth : false
        })

        new_post.save((err, post) => {
            if(err) {
                next(err);
            }

            res.status(204)
            res.json({
                msg: 'post is saved',
                status: true,
                code: 204
            })
        })
    }
    
    else {
        res.status(400)
        res.json({
            msg: 'you are not allowed to add posts',
            status: false,
            code: 400
        })
    }   
}
