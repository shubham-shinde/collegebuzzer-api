import { Clubs } from '../../mongoose/mongoosConfig';
import { ROLES } from '../../appconfig.js'

export default {
    post : _post
}

function _post (req, res, next) {

    if(req.session.role === ROLES[2]) {    
        Clubs.findOne({_id : req.body._id }).exec((err, club) => {
            if(club) {
                if(req.body.auth) {
                    club.is_auth = true;
                }
                else {
                    club.is_auth = false;
                }
                club.save((err)=> {
                    if(err) {
                        next(err)
                    }
                    res.stutus(204)
                    res.json({
                        msg: 'yup',
                        status: true,
                        code: 204
                    })
                })
            }
            else {
                res.stutus(404)
                    res.json({
                        msg: 'post not found',
                        status: true,
                        code: 404
                    })
            }
        })

    }
    else {
        res.status(400)
        res.json({
            msg: 'dont you try',
            status: false,
            code: 400
        })
    }   
}