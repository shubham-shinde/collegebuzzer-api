import { STU_POSTS, CLUB_POSTS, Students, Clubs } from '../../mongoose/mongoosConfig';
import { ROLES, AWS_S3, AWS_S3_LINK } from '../../appconfig.js'
import im from 'imagemagick'
import AWS from 'aws-sdk'
import fs from 'fs';

export default {
    post : _post
}

function uploadPicToS3(files, name, res, next) {
    AWS.config = AWS_S3;

    var s3Bucket = new AWS.S3( { params: {Bucket: 'photosfortheapp'} } )

    files.forEach((element, index) => {
        const NameOfPic = name+index;
        const NameOfPicPre = name+index+'pre'

        if(element.mimetype === 'video/mp4') {
            return fs.readFile(element.path,(err, pic) => {
                const data = {Key: 'posts/'+NameOfPic+'.mp4', Body: pic};
                s3Bucket.putObject(data, function(err, data){
                if (err) 
                    { 
                        res.status(400)
                        return res.json({
                            msg: 'there is problem in server please try again.',
                            status: true,
                            code: 400
                        })
                    } 
                    else {
                        console.log('succesfully uploaded the video!');
                        fs.unlink(element.path,() => console.log('deleted'))
                        if(index+1 === files.length ) {
                            res.status(200)
                            return res.json({
                                msg: 'post is saved',
                                show_msg : {
                                    h: 'Post Saved',
                                    detail: 'Your post has been saved. Kindly refresh the window to see the post.'
                                },
                                status: true,
                                code: 204
                            })
                        }
                    }
                });
            })
        }

        im.resize({
            srcPath: element.path,
            dstPath: element.desination+NameOfPic,
            width:   1000
        },
        function(err, stdout, stderr){
            if (err) {
                res.status(400)
                return res.json({
                    msg: 'only image are allowed',
                    status: true,
                    code: 400
                })
            }

            fs.readFile(element.desination+NameOfPic,(err, pic) => {
                const data = {Key: 'posts/'+NameOfPic+'.jpg', Body: pic};
                s3Bucket.putObject(data, function(err, data){
                if (err) 
                    { 
                        res.status(400)
                        return res.json({
                            msg: 'there is problem in server please try again.',
                            status: true,
                            code: 400
                        })
                    } 
                    else {
                        console.log('succesfully uploaded the image!');
                        fs.unlink(element.desination+NameOfPic,() => console.log('deleted'))
                        im.resize({
                            srcPath: element.path,
                            dstPath: element.desination+NameOfPicPre,
                            width:   10
                        },
                        function(err, stdout, stderr){
                            if (err) {
                                res.status(400)
                                return res.json({
                                    msg: 'there is problem in server please try again.',
                                    status: true,
                                    code: 400
                                })
                            }
                
                            fs.readFile(element.desination+NameOfPicPre,(err, pic) => {
                                const data = {Key: 'posts/'+NameOfPicPre+'.jpg', Body: pic};
                                s3Bucket.putObject(data, function(err, data){
                                if (err) 
                                    { 
                                        res.status(400)
                                        return res.json({
                                            msg: 'there is problem in server please try again.',
                                            status: true,
                                            code: 400
                                        })
                                    } 
                                    else {
                                        console.log('succesfully uploaded the image!');
                                        fs.unlink(element.desination+NameOfPicPre,() => console.log('deleted'))
                                        fs.unlink(element.path,() => console.log('deleted'))
                                        if(index+1 === files.length ) {
                                            res.status(200)
                                            return res.json({
                                                msg: 'post is saved',
                                                show_msg : {
                                                    h: 'Post Saved',
                                                    detail: 'Your post has been saved. Kindly refresh the window to see the post.'
                                                },
                                                status: true,
                                                code: 204
                                            })
                                        }
                                    }
                                });
                            })            
                        });
                    }
                });
            })            
        });
    });
}

function _post (req, res, next) {
    const post_data = req.body;
    console.log('reqbody', req.body);
    if(req.session.role === ROLES[0]) {       
        
        Students.findOne({_id: req.session.Id}).exec((err, student) => {
            if(err){
                next(err);
            }
            if(!student) {
                res.status(401)
                return res.json({
                    msg: "your not in database",
                    status: true,
                    code: 401
                })
            }
            if(!student.p_pic) {
                student.p_pic = AWS_S3_LINK+'profile/'+student._id+'.jpg'
            }
            console.log(req.files);
            const new_post = STU_POSTS({
                name : student.name,
                Id : req.session.Id,
                userIntro : student.userIntro,
                text : post_data.text,
                n_pics : req.files.length,
                n_videos : req.files.reduce((sum, video) => video.mimetype==='video/mp4' ? sum+1 : sum , 0),
                p_pic : student.p_pic,
                likes : [],
                is_auth : true,
                only_for_stu : post_data.only_for_stu ? post_data.only_for_stu : false
            })

            new_post.save((err, post) => {
                if(err) {
                    next(err);
                }
    
                student.h_posts  = [post._id , ...student.h_posts];

                student.save((err) => {
                    if(err){
                        console.log(err);
                        next(err);
                    }
                    console.log(req.files)
                    if(req.files.length >= 1 ) {
                        const filess = [...req.files.filter((item) => item.mimetype!=='video/mp4'), ...req.files.filter((item)=> item.mimetype==='video/mp4')]
                        uploadPicToS3(filess, post._id, res, next)
                    }
                    else {
                        res.status(200)
                        res.json({
                            msg: 'post is saved',
                            show_msg : {
                                h: 'Post Saved',
                                detail: 'Your post has been saved. Kindly refresh the window to see the post.'
                            },
                            status: true,
                            code: 204
                        })
                    }
                })   
            })         
        })
    }
    else if (req.session.role === ROLES[1]) {
        console.log('you are a club')
        Clubs.findOne({_id: req.session.Id}).exec((err, club) => {
            if(err){
                next(err);
            }
            if(!club) {
                res.status(401)
                return res.json({
                    msg: "your not in database",
                    status: true,
                    code: 401
                })
            }
            if(!club.p_pic) {
                club.p_pic = AWS_S3_LINK+'profile/'+club._id+'.jpg'
            }
            const new_post = CLUB_POSTS({
                name : club.name,
                Id : req.session.Id,
                p_pic : club.p_pic,
                text : post_data.text,
                n_pics : req.files.length,
                n_videos : req.files.reduce((sum, video) => video.mimetype==='video/mp4' ? sum+1 : sum , 0),
                time : Date.now(),
                likes : [],
                is_auth : true,
                only_for_stu : post_data.only_for_stu ? post_data.only_for_stu: false
            })

            new_post.save((err, post) => {
                if(err) {
                    next(err);
                }
    
                club.h_posts  = [post._id, ...club.h_posts];

                club.save((err) => {
                    if(err){
                        next(err);
                    }
                    console.log(req.files)
                    if(req.files.length >= 1) {
                        const filess = [...req.files.filter((item) => item.mimetype!=='video/mp4'), ...req.files.filter((item)=> item.mimetype==='video/mp4')]
                        uploadPicToS3(filess, post._id,res, next)
                    }
                    else {
                        res.status(200)
                        res.json({
                            msg: 'post is saved',
                            show_msg : {
                                h: 'Post Saved',
                                detail: 'Your post has been saved. Kindly refresh the window to see the post.'
                            },
                            status: true,
                            code: 204
                        })
                    }
                })   
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