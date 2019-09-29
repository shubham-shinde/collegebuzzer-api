import jwt from 'jsonwebtoken';
import { ROLES } from '../appconfig'
// import Logger from '../../buildTools/logger';

const session = (opts) => {
  const { secret } = opts;
  const middleware = function (req, res, next) {
    console.log(req.path)
    if (req.path === '/' || req.path === '/clubforlogin' || req.path === '/admin/login' || req.path.slice(0,13) === '/setpassword/' || req.path === '/student/login' || req.path === "/student/register" || req.path === "/club/login" || req.path === '/guest/login' || req.path === "/guest/register" ) {
      console.log('fresh')
      return next();
    }

    let authToken = undefined;

    if (req.header) {
      authToken = req.header('xxx-kon-token');
      jwt.verify(authToken, secret, function (err, user) {
        if (err) {
          return next(err);
        }
  
        const Id = user.Id;
        const role = user.role;
  
        if (typeof (role) === undefined) {
          return next(new Error('role not found'));
        }
          if(role === ROLES[0]) {
            req.session = {};
            req.session.Id = Id;
            req.session.role = role;
            req.session.year = user.year
            req.session.branch = user.branch
            req.session.mail = user.mail;
            next();
          }
          else if (role === ROLES[1] || role === ROLES[2] || role === ROLES[3] ) {
            req.session = {};
            req.session.Id = Id;
            req.session.role = role;
            req.session.mail = user.mail;
            next();
          }
        });
    }
    else {
      res.json({
        msg : 'fuck! you don"t have token'
      })
    }

    // if (!authToken) {
    //   return noTokenAuth.setAuth(req, next, { secret: secret });
    // }
    // logger.log('auth token ', authToken);
    
  };
  return middleware;
};

export default session;