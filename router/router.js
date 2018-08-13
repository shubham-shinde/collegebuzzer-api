import common from '../controllers/common'
import post from '../controllers/post/';
import student from '../controllers/student/'
import conf from '../controllers/conf/'
import club from '../controllers/club/'
import admin from './../controllers/admin/'
import guest from "../controllers/guest/";
//import validate from './../controllers/validate';
const { homeController, search, basic, getProfile, updateProfile } = common
const { postStuGet, postClubGet, postLike, postAdd, postDel, postGet } = post
const { stuRegister, stuLogin, stuSetPass, stuResetPass, stuGetOne } = student
const { clubSetPass, clubResetPass, clubAdd, clubLogin, clubGetOne, clubForLogin } = club
const { confAdd, confAuth, confGet } = conf
const { adminAdd, adminLogin } = admin
const { guestLogin, guestRegister, guestResetPass, guestSetPass } = guest


export default function(app) {
    app.get('/', homeController.get);
    app.get('/basic', basic.get);
    app.get('/search/:search', search.get);
    app.get('/getprofile/:_id', getProfile.get)
    app.post('/updateprofile', updateProfile.post);

    //guest routes...............................................................................
    app.post('/guest/register', guestRegister.post)
    app.post('/guest/login', guestLogin.post)


    //post routes............................................................................
    app.get('/getstuposts/:_id', postStuGet.get);
    app.get('/getclubposts/:_id', postClubGet.get);
    app.post('/addpost', postAdd.post);
    app.post('/delpost/:_id', postDel.get);
    app.post('/likepost/:_id', postLike.post);
    //app.post('/gettheseposts', postGet.post);

    //app.post('/validate', validate.post);

    //student routes............................................................................
    app.post('/student/register', stuRegister.post)
    app.post('/student/login', stuLogin.post)
    app.get('/student/profile/:_id',stuGetOne.get)
    // app.get('/student/mydetails') //<-----------


    //conf routes.......................................................................
    app.post('/addconf', confAdd.post)
    app.get('/admin/authconf/:_id', confAuth.get)
    app.get('/getconfs/:_id', confGet.get)
    app.get('/admin/getconfs/:_id', confGet.get2)


    //club routes.........................................................................
    app.post('/club/login', clubLogin.post)
    app.get('/club/profile/:_id', clubGetOne.get)
    app.get('/clubforlogin',clubForLogin.get)

    //authanticaton routes.........................................................................
    app.get('/setpassword/student/:who', stuSetPass.get);
    app.post('/setpassword/student/:who', stuSetPass.post);
    app.get('/resetpassword/student', stuResetPass.post);

    app.get('/setpassword/club/:who', clubSetPass.get);
    app.post('/setpassword/club/:who', clubSetPass.post);
    app.get('/resetpassword/club', clubResetPass.post);

    app.get('/setpassword/guest/:who', guestSetPass.get); 
    app.post('/setpassword/guest/:who', guestSetPass.post);
    app.get('/resetpassword/guest', guestResetPass.post);
    // app.post('/student/club', clubLogin.post);



    // admin routes....................................................................................
    // app.post('/admin/login') //<-------------
    // app.get('/admin/deleteStuAccount/:_id') //<---------
    // app.get('/admin/deleteClubAccount/:_id') //<---------
    // app.get('/admin/deletePost/:_id') //<---------
    // app.get('/admin/deleteConf/:_id') //<---------
    app.post('/admin/addadmin',adminAdd.post);
    app.post('/admin/login', adminLogin.post);    
    app.post('/admin/addclub' ,clubAdd.post);

    app.use(function errorHandler (err, req, res, next) {
        if (res.headersSent) {
            return next(err)
        }
        res.status(500)
        console.log(err)
        return res.json({
            msg: 'there is some problem in server.',
            status: false,
            code: 500
        })
      }
    )
}