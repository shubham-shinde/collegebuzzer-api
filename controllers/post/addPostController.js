import { Posts, Students, Branchs } from '../../mongoose/mongoosConfig';

export default {
    post : _post
}

function _post (req, res) {
    const post_data = req.body;

    find_no_of_post().then((count) => {
        console.log(count)
        const old_id = count;
        const new_post = Posts({
            // new id is the no. of posts in db +1.
            id : old_id+1,
            rollno : post_data.rollno,
            name: post_data.name, //1609713098
            userID : post_data.userID, // 16RITB01
            userIntro : post_data.userIntro, //2nd yr IT
            text : post_data.text,
            pics : post_data.pics,
            time : Date.now(),
            likes : 1,
            liked_by : [ post_data.userID ],
            comment : []
        })
        new_post.save((err) => {
            if(err)
                next(err);
            Students.findOne({ userID: post_data.userID }).exec((err, student) => {
                if(err)
                    next(err);
                student.h_post.push(new_post);
                Students.save((err) => {
                    if(err)
                        next(err);
                    const branch_detail = find_year_section_and_branch(post_data.userID);
                    Branchs.findOne({ name: branch_detail.branch, year: branch_detail.year}).exec((err, branch_of_user) => {
                        if(err)
                            next(err);
                        branch_of_user.no_of_post = 1 + branch_of_user.no_of_post;
                        Branchs.save((err) => {
                            if(err)
                                next(err);
                            res.send("Now post has been generated");
                        })
                    })
                })
            })
        });
    })
    
}

function find_no_of_post () {
    const post_count = Posts.count();
    const post_count_promise = post_count.exec();
    return post_count_promise;
}

function find_year_section_and_branch(userID) {
    const user_id = userID
    const year = 2000 + Number(user_id.substring(0,2))
    const branch = user_id.substring(3,5);
    const section = user_id[5]
    return { year, branch, section };
}