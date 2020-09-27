import { Students, Clubs } from "../../mongoose/mongoosConfig";
import FormData from "form-data";
import fetch from "node-fetch";
import { ROLES, AWS_S3, AWS_S3_LINK, IMGDB_KEY } from "../../appconfig.js";
import im from "imagemagick";
import AWS from "aws-sdk";
import fs from "fs";

export default {
  post: _post,
};

export const uploader = async (picPath, picName) => {
  try {
    const body = new FormData();
    body.append("image", fs.createReadStream(picPath));
    body.append("name", picName);
    let res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGDB_KEY}`, {
      method: "POST",
      body,
    });
    return await res.json();
  } catch (err) {
    throw err;
  }
};

function uploadPicToS3(files, object, res, next) {
  files.forEach((element, index) => {
    const NameOfPic = object.id;
    const NameOfPicPre = object.id + "pre";
    im.resize(
      {
        srcPath: element.path,
        dstPath: element.destination + NameOfPic,
        width: 500,
      },
      function(err, stdout, stderr) {
        if (err) throw err;
        const picPath = element.destination + NameOfPic;
        uploader(picPath, NameOfPic).then(({ data: imgData }) => {
          console.log("succesfully uploaded the image!");
          fs.unlink(element.destination + NameOfPic, () =>
            console.log("deleted")
          );
          im.resize(
            {
              srcPath: element.path,
              dstPath: element.destination + NameOfPicPre,
              width: 40,
            },
            function(err, stdout, stderr) {
              if (err) throw err;
              const picPath = element.destination + NameOfPicPre;
              uploader(picPath, NameOfPicPre).then(({ data: preImgData }) => {
                console.log("pre succesfully uploaded the image!");
                fs.unlink(element.destination + NameOfPicPre, () =>
                  console.log("deleted")
                );
                fs.unlink(element.path, () => console.log("deleted"));
                res.status(200);
                object.p_pic = imgData.display_url;
                object.pre_pic = preImgData.display_url;
                object.save();
                res.json({
                  msg: "post is saved",
                  status: true,
                  code: 204,
                });
              });
            }
          );
        });
      }
    );
  });
}

function _post(req, res, next) {
  const data = req.body;
  if (req.files.length > 1) {
    res.status(405);
    res.json({
      msg: "you cant set dps more than one",
      status: false,
      code: 405,
    });
    return;
  }

  if (req.session.role === ROLES[0]) {
    Students.findOne({ _id: req.session.Id }).exec((err, student) => {
      if (err) {
        next(err);
      }
      student.bio = data.bio ? data.bio : student.bio;
      student.theme = data.theme ? data.theme : student.theme;
      if (req.files.length >= 1) {
        uploadPicToS3(req.files, student, res, next);
      } else {
        student.save();
        res.status(200);
        res.json({
          msg: "post is saved",
          status: true,
          code: 204,
        });
      }
    });
  } else if (req.session.role === ROLES[1]) {
    Clubs.findOne({ _id: req.session.Id }).exec((err, student) => {
      if (err) {
        next(err);
      }
      student.bio = data.bio ? data.bio : student.bio;
      student.theme = data.theme ? data.theme : student.theme;
      if (req.files.length >= 1) {
        uploadPicToS3(req.files, student, res, next);
      } else {
        student.save();
        res.status(200);
        res.json({
          msg: "post is saved",
          status: true,
          code: 204,
        });
      }
    });
  } else {
    res.status(400);
    res.json({
      msg: "you are not allowed to update profile pic",
      status: false,
      code: 400,
    });
  }
}

