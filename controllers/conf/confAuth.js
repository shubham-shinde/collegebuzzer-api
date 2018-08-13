import { Confessions } from '../../mongoose/mongoosConfig';
import { ROLES } from '../../appconfig.js'

export default {
    get : _get
}

function _get (req, res, next) {

    const _id = req.params._id;

    if(req.session.role === ROLES[2]) {    
        Confessions.findOne({_id : _id }).exec((err, club) => {
            if(club) {
                
                club.is_auth = true;
                club.save((err)=> {
                    if(err) {
                        next(err)
                    }
                    res.status(200)
                    res.json({
                        msg: 'yup',
                        status: true,
                        code: 204
                    })
                })
            }
            else {
                res.status(404)
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