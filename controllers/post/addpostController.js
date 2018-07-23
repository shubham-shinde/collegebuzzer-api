import { Posts, Students, Clubs } from '../../mongoose/mongoosConfig';
import { ROLES, AWS_S3 } from '../../appconfig.js'
import im from 'imagemagick'
import AWS from 'aws-sdk'
import fs from 'fs';

export default {
    post : _post
}

function uploadPicToS3(files, name) {
    AWS.config = AWS_S3;

    var s3Bucket = new AWS.S3( { params: {Bucket: 'photosfortheapp'} } )

    files.forEach((element, index) => {
        const NameOfPic = name+index;
        const NameOfPicPre = name+index+'pre'
        im.resize({
            srcPath: element.path,
            dstPath: element.desination+NameOfPic,
            width:   1000
        },
        function(err, stdout, stderr){
            if (err) throw err;

            fs.readFile(element.desination+NameOfPic,(err, pic) => {
                const data = {Key: 'posts/'+NameOfPic+'.jpg', Body: pic};
                s3Bucket.putObject(data, function(err, data){
                if (err) 
                    { 
                        console.log('Error: ', err); 
                    } 
                    else {
                        console.log('succesfully uploaded the image!');
                        fs.unlink(element.desination+NameOfPic,() => console.log('deleted'))
                        im.resize({
                            srcPath: element.path,
                            dstPath: element.desination+NameOfPicPre,
                            width:   40
                        },
                        function(err, stdout, stderr){
                            if (err) throw err;
                
                            fs.readFile(element.desination+NameOfPicPre,(err, pic) => {
                                const data = {Key: 'posts/'+NameOfPicPre+'.jpg', Body: pic};
                                s3Bucket.putObject(data, function(err, data){
                                if (err) 
                                    { 
                                        console.log('Error: ', err); 
                                    } 
                                    else {
                                        console.log('succesfully uploaded the image!');
                                        fs.unlink(element.desination+NameOfPicPre,() => console.log('deleted'))
                                        fs.unlink(element.path,() => console.log('deleted'))
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

    if(req.session.role === ROLES[0]) {
        
        
        Students.findOne({_id: req.session.Id}).exec((err, student) => {
            if(err){
                next(err);
            }
    
            const new_post = Posts({
                f_name : student.f_name,
                m_name : student.m_name,
                l_name : student.l_name,
                Id : req.session.Id,
                userIntro : student.userIntro,
                text : post_data.text,
                n_pics : req.files.length,
                p_pic : student.p_pic,
                time : Date.now(),
                likes : 1,
                liked_by : [ req.session.id ],
                is_auth : true
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
                    uploadPicToS3(req.files, post._id)
                    res.status(204)
                    res.json({
                        msg: 'post is saved',
                        status: true,
                        code: 204
                    })
                })   
            })         
        })
    }
    else if (req.session.role === ROLES[1]) {

        Clubs.findOne({_id: req.session.Id}).exec((err, club) => {
            if(err){
                next(err);
            }
    
            const new_post = Posts({
                f_name : club.f_name,
                l_name : 'Club',
                Id : req.session.Id,
                text : post_data.text,
                pics : req.files.length,
                time : Date.now(),
                likes : 0,
                liked_by : [],
                is_auth : true
            })

            new_post.save((err, post) => {
                if(err) {
                    next(err);
                }
    
                club.h_posts  = [post_id, ...h_posts];

                club.save((err) => {
                    if(err){
                        next(err);
                    }
                    uploadPicToS3(req.files, post._id)
                    res.status(204)
                    res.json({
                        msg: 'post is saved',
                        status: true,
                        code: 204
                    })
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