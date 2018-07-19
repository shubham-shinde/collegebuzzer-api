import homeController from '../controllers/homeController';
import posts from '../controllers/post/postsController';
import increaseLike from '../controllers/post/increaseLikeController';
import addPost from '../controllers/post/addPostController';
import studentSignup from '../controllers/student/studentSignup';
import studentLogin from '../controllers/student/studentLogin';
import setPassword from '../controllers/setPasswordController';
import resetpassword from '../controllers/student/resetpassword'
//import addbranchs from './../controllers/addbranchs';
//import validate from './../controllers/validate';

export default function(app) {
    app.get('/', homeController.get);
    app.get('/post/:page', posts.get); //<----
    app.get('/post/delete') //<----
    
    app.post('/post/add', addPost.post);
    app.post('/post/like', increaseLike.put);

    //app.post('/addBranch', addbranchs.post);
    //app.post('/validate', validate.post);

    app.post('/student/register', studentSignup.post);
    app.post('/student/edit') //<----
    app.post('/student/login', studentLogin.post);
    app.get('/setpassword/:who', setPassword.get);
    app.post('/setpassword/:who', setPassword.post);
    app.get('/resetpassword', resetpassword.get)
    //app.post('/student/bioUpdate', studentUpdate.post);
}