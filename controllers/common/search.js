import { Students } from '../../mongoose/mongoosConfig';

export default {
    get : _get
}

function _get (req, res, next) {
    const text = req.params.search;
    const regex = new RegExp(text+'|'+text.toUpperCase()+'|'+text.toLowerCase())
    Students.find({name: regex}).limit(5).exec((err, stus) => {
        if(err) {
            return next(err);
        }
        if(stus || stus !== undefined ) {
            const students =stus.map((data) => {
                return {
                    name: data.name,
                    h_posts: data.h_posts,
                    _id: data._id,
                    userIntro: data.userIntro,
                    p_pic: data.p_pic
                }
            })
            res.status(200)
            return res.json({
                msg: 'your search result',
                data: students,
                status: true,
                code: 200
            })
        }
        else {
            res.status(200)
            return res.json({
                msg: 'NO one with this name',
                status: false,
                code: 404
            })
        }
    })
}
