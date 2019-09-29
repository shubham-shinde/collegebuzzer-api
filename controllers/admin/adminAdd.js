import { Admins } from '../../mongoose/mongoosConfig';
import jwt from 'jsonwebtoken';
import bycrpt from 'bcryptjs';
import path from 'path';

export default {
    post : _post
}

function _post (req, res, next) {
    const password = bycrpt.hashSync('vara4321',4);
            
            
    const new_student = Admins({
        name : 'Shubham shinde',
        mail : 'shindes0321@gmail.com',
        password,
        is_auth : true,
    })
                    
    new_student.save((err) => {
        if(err)
            next(err);       
    })

    res.status(201)
    res.json({
        msg: "your password is saved",
        status: true,
        code: 201
    })
}