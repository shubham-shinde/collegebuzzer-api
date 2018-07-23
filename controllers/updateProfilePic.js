import { Students, Clubs } from '../../mongoose/mongoosConfig';
import { ROLES, AWS_S3, AWS_S3_LINK } from '../../appconfig.js'
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
            width:   500
        },
        function(err, stdout, stderr){
            if (err) throw err;

            fs.readFile(element.desination+NameOfPic,(err, pic) => {
                const data = {Key: 'profile/'+NameOfPic+'.jpg', Body: pic};
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
                                const data = {Key: 'profile/'+NameOfPicPre+'.jpg', Body: pic};
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
    if(req.files.length > 1) {
        res.status(405)
        res.json({
            msg: 'you cant set dps more than one',
            status: false,
            code: 405
        })
        return;
    }

    if(req.session.role === ROLES[0]) {
        
        
        Students.findOne({_id: req.session.Id}).exec((err, student) => {
            if(err){
                next(err);
            }

            student.p_pic = AWS_S3_LINK+'profile/'+student._id+'.jpg'
            student.save((err) => {
                if(err){
                    console.log(err);
                    next(err);
                }
                uploadPicToS3(req.files, student._id)
                res.status(204)
                res.json({
                    msg: 'post is saved',
                    status: true,
                    code: 204
                })
            })         
        })
    }
    else if (req.session.role === ROLES[1]) {

        Clubs.findOne({_id: req.session.Id}).exec((err, student) => {
            if(err){
                next(err);
            }

            student.p_pic = AWS_S3_LINK+'profile/'+student._id+'.jpg'
            student.save((err) => {
                if(err){
                    console.log(err);
                    next(err);
                }
                uploadPicToS3(req.files, student._id)
                res.status(204)
                res.json({
                    msg: 'post is saved',
                    status: true,
                    code: 204
                })
            })         
        })
    } 
    else {
        res.status(400)
        res.json({
            msg: 'you are not allowed to update profile pic',
            status: false,
            code: 400
        })
    }          
}