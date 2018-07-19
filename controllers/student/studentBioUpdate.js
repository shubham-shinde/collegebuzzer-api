import { Students, Branchs } from '../../mongoose/mongoosConfig';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET } from '../../appconfig';

export default {
    post : _post
}

function _post (req, res) {
    console.log("got a post request to register")
    const bio = req.body.bio;

    Students.findOne({_id: req.session.id}).exec((err, doc) => {
        if(err)
            next(err);
        
        if(bio) {
            doc.bio = bio;
            doc.save(() => {
                res.json({
                    msg: 'bio is saved and plz check the mail to set password',
                    status: true
                })
            })
        }
        else {
            res.json({
                msg: "bio cant be null",
                status: false,
            })
        }
    })
}