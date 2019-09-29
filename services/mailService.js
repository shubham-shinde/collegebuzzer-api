import { MAIL_SERVICE_MAIL, MAIL_SERVICE_PASSWORD } from '../appconfig'
import nodemailer from 'nodemailer';

export default ({to,link}) => {
    console.log('mail to be sent to '+to);
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: MAIL_SERVICE_MAIL, // generated ethereal user
                pass: MAIL_SERVICE_PASSWORD // generated ethereal password
            },
            tls: {
                rejectUnauthorized:false
            }
        });

        // setup email data with unicode symbols
        console.log(link)
        let mailOptions = {
            from: '"CollegeBuzzer" <'+MAIL_SERVICE_MAIL+'>', // sender address
            to: to, // list of receivers
            subject: 'Set password', // Subject line
            text: 'Open link to set password', // plain text body
            html: `<h1 style='color:teal;'>CollegeBuzzer</h1>
                This is your link to<br/>
                click the button within 50 minutes of registration.<br/>
                <h5>After 50 minutes link will not work.</h5><br/>
                <h2>${link}</a></h3>` // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
}