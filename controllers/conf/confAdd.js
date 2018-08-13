import { Confessions } from '../../mongoose/mongoosConfig';
import { ROLES } from '../../appconfig.js'

export default {
    post : _post
}

function _post (req, res, next) {
    const post_data = req.body;
    
    req.checkBody("text", 'invalid credentials')
    req.checkBody("theme", 'invalid credentials').isAlpha()

    var errors = req.validationErrors();

    if (errors) {
        res.status(406)
        res.json({
            error: errors,
            status: false,
            code: 406
        });
        return;
    }

    if(req.session.role === ROLES[0]) {    
        const new_post = Confessions({
            text : post_data.text,
            theme : post_data.theme,
            time : Date.now(),
            year : req.session.year,
            branch : req.session.branch,
            is_auth : false
        })

        new_post.save((err, post) => {
            if(err) {
                next(err);
            }

            res.status(200)
            res.json({
                msg: 'conf is saved',
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
