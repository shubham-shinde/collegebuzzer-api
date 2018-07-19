import jwt from 'jsonwebtoken';
// import Logger from '../../buildTools/logger';

const session = (opts) => {
  const { secret } = opts;

  const middleware = function (req, res, next) {
    console.log(req.path);
    if (req.path === '/login' || req.path.slice(0,13) === '/setpassword/' || req.path === '/student/login' || req.path === "/student/register") {
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

      const id = user.id;
      const mode = user.mode;

      const sessionString = "fucked_up_students"+ id ;

      if (typeof (mode) === undefined) {
        return next(new Error('mode not found'));
      }

      req.store.hgetall(sessionString, function (err, value) {
        if (err) {
          return next(err);
        }


        console.log(value)
        req.session = {};
        req.session.userId = id;
        req.session.role = value.role;
        req.session.userId = value.userId;
        req.session.mail = value.mail;
        next();
      });
    });
  };
  return middleware;
};

export default session;