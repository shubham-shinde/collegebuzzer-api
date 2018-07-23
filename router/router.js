import homeController from '../controllers/homeController';

import posts from '../controllers/post/postsController';
import increaseLike from '../controllers/post/increaseLikeController';
import addPost from '../controllers/post/addpostController';
import delPost from '../controllers/post/delPostCont.js';

import studentSignup from '../controllers/student/studentSignup';
import studentLogin from '../controllers/student/studentLogin';
import setPassword from '../controllers/student/setPasswordController';
import resetpassword from '../controllers/student/resetpassword'

import addConf from '../controllers/conf/addconfController'
import authConf from '../controllers/conf/authconfController'
import getConf from '../controllers/conf/confController';

import setPasswordClub from '../controllers/club/setPasswordclub'
import resetpasswordClub from '../controllers/club/resetPassclub'
import clubSignup from '../controllers/club/addClub';
import clubLogin from '../controllers/club/clubLogin';
//import addbranchs from './../controllers/addbranchs';
//import validate from './../controllers/validate';

export default function(app) {
    app.get('/', homeController.get);
    app.post('/getpost/:_id', posts.post); //<----
    
    app.post('/addPost', addPost.post);
    app.post('/delPost', delPost.post);
    app.post('/post/like', increaseLike.put);

    //app.post('/addBranch', addbranchs.post);
    //app.post('/validate', validate.post);

    //conf routes.......................................................................
    app.post('student/addconf', addConf.post)
    app.post('admin/authconf', authConf.post)
    app.post('/getconf', getConf.post)


    //club routes.........................................................................


    //authanticaton routes.........................................................................
    app.post('/student/register', studentSignup.post);
    app.post('/student/edit') //<----
    app.post('/student/login', studentLogin.post);

    app.get('/setpassword/student/:who', setPassword.get);
    app.post('/setpassword/student/:who', setPassword.post);
    app.get('/resetpassword/student', resetpassword.get);

    app.get('/setpassword/club/:who', setPasswordClub.get);
    app.post('/setpassword/club/:who', setPasswordClub.post);
    app.get('/resetpassword/club', resetpasswordClub.get);
    app.post('/student/club', clubLogin.post);

    //app.post('/student/bioUpdate', studentUpdate.post);
}