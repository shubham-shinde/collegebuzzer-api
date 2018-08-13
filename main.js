import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import http from 'http';
import validator from 'express-validator/index.js';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import compression from 'compression';
import multer from 'multer';
import path from 'path';

import redisClient from './middleware/redis';
import session from './middleware/session';
import { SESSION_SECRET, SERVER_PORT } from './appconfig'


import router from './router/router';

const PORT = SERVER_PORT;

const app = express();
const upload = multer({
    dest: 'uploads/',
    limits: {fileSize: '8MB'},
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !==".JPG"  && ext !==".JPEG" && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are acceptable'))
        }
        callback(null, true)
    },
});

app.server = http.createServer(app);

//clears the console.
app.use(clearConsole);
app.use(logger('dev'));

//for form data.
app.use(upload.array('pic'))

//middleware with nothing
app.use((req, res, next) => {
    next()
})

//for gzip files.
app.use(compression())

//for cross-origin-resource-sharing
app.use(cors());

//for input validation
app.use(validator());

app.use(express.static(path.join(__dirname,'static')))

//to read from body of request.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({extended: false, limit: '8MB'}));

app.use(redisClient());
app.use(session({ secret: SESSION_SECRET }))

//setting view engine
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// app.use(clearConsole)
function clearConsole(req,res,next){
    console.log(req.session);
    //console.log('\x1Bc');
    next();
}

//All the routes.
router(app);

app.server.listen(PORT, (err) => {
    if (err)
        console.log("server cant start due to::::"+ err);
    else
        console.log("server is running on the port "+ PORT);
})