import jwt from 'jsonwebtoken';
import { ROLES } from '../appconfig'
// import Logger from '../../buildTools/logger';

const session = (opts) => {
  const { secret } = opts;

  const middleware = function (req, res, next) {
    console.log(req.path);
    if (req.path === '/' || req.path === '/login' || req.path.slice(0,13) === '/setpassword/' || req.path === '/student/login' || req.path === "/student/register") {
      return next();
    }

    let authToken = undefined;

    if (req.header) {
      authToken = req.header('xxx-kon-token');
    }


    // if (!authToken) {
    //   return noTokenAuth.setAuth(req, next, { secret: secret });
    // }
    // logger.log('auth token ', authToken);
    jwt.verify(authToken, secret, function (err, user) {
      if (err) {
        return next(err);
      }

      const Id = user.Id;
      const role = user.role;

      const sessionString = "fucked_up_students"+ Id ;

      if (typeof (role) === undefined) {
        return next(new Error('role not found'));
      }

      req.store.hgetall(sessionString, function (err, value) {
        if (err) {
          return next(err);
        }


        if(role === ROLES[0]) {
          req.session = {};
          req.session.Id = Id;
          req.session.role = role;
          req.session.year = value.year
          req.session.branch = value.branch
          req.session.mail = value.mail;
          next();
        }
        else if (role === ROLES[1]) {
          req.session = {};
          req.session.Id = Id;
          req.session.role = role;
          req.session.f_name = value.f_name;
          req.session.mail = value.mail;
        }
      });
    });
  };
  return middleware;
};

export default session;