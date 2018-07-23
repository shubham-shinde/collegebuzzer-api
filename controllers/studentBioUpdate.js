import { Students, Branchs } from '../../mongoose/mongoosConfig';
import jwt from 'jsonwebtoken';
import { SESSION_SECRET } from '../../appconfig';
import { ROLES } from '../appconfig';
import { Clubs } from '../mongoose/mongoosConfig';

export default {
    post : _post
}

function _post (req, res) {
    console.log("got a post request to register")
    const bio = req.body.bio;

    if(req.session.role === ROLES[0]) {
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
    else if (req.session.role === ROLES[1]) {
        Clubs.findOne({_id: req.session.id}).exec((err, doc) => {
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
}