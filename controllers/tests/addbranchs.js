import { Branchs } from '../../mongoose/mongoosConfig';

export default {
    post : _post
}

function _post (req, res) {
    const post_data = req.body;
    const new_post = Branchs({
        name : post_data.name,
        year : post_data.year,
        t_stu : 0,
        A : [],
        B : [],
        no_A : 0,
        no_B : 0,
        no_of_post :0
    })
    new_post.save((err) => {
        if(err) {
            next(err);
        }
        else
            res.send("branch is add")
    });    
}