import { Students, Branchs } from "../../mongoose/mongoosConfig";
import sendSetPasswordMail from "../../services/mailService";
import jwt from "jsonwebtoken";
import { SESSION_SECRET, SERVER_URL, ROLES } from "../../appconfig";

export default {
  post: _post,
};

function _post(req, res, next) {
  console.log(req.body);
  req.checkBody("year", "invalid credentials").isInt({ min: 1, max: 4 });
  req
    .checkBody("sec", "invalid credentials")
    .isUppercase()
    .isLength(1)
    .isIn(["A", "B", "C"]);
  req
    .checkBody("clgId", "invalid credentials")
    .isUppercase()
    .isAlphanumeric()
    .isLength(11);
  req
    .checkBody("branch", "invalid credentials")
    .isUppercase()
    .isIn(["IT", "CS", "EE", "E3", "EC", "EI", "ME", "CE"]);
  req
    .checkBody("gen", "invalid credentials")
    .isUppercase()
    .isLength(1)
    .isIn(["M", "F"]);
  req.checkBody("name", "invalid credentials");
  req.checkBody("mail", "invalid credentials").isEmail();

  var errors = req.validationErrors();

  if (errors) {
    res.status(406);
    res.json({
      error: errors,
      msg: "Wrong credentials are submitted. Fill form again with valid data.",
      status: false,
      code: 406,
    });
    return;
  } else {
    Students.findOne({ mail: req.body.mail }).exec((err, doc) => {
      if (err) return next(err);
      if (!doc) {
        const token = jwt.sign(
          { mail: req.body.mail, branch: req.body.branch, year: req.body.year },
          SESSION_SECRET
        );
        const link = SERVER_URL + "/setpassword/student/" + token.toString();

        const newStuString = "student" + token;

        req.store.hmset(
          newStuString,
          {
            ...req.body,
          },
          function(err, redisRes) {
            if (err) {
              return next(err);
            }
            req.store.expire(newStuString, 60 * 100);
            sendSetPasswordMail({ to: req.body.mail, link });
            res.status(200);
            return res.json({
              msg: `Link has been send on provided Email.
                            Open it within half an hour to set password and complete registration.`,
              status: true,
              status: 200,
            });
          }
        );
      } else {
        res.status(404);
        res.json({
          msg: "Email id already exists",
          show_msg: {
            h: "Error",
            msg: "Your mail is already registerd",
          },
          status: false,
          status: 404,
        });
      }
    });
  }
}
