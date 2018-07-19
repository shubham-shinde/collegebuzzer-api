import { MAIL_SERVICE_MAIL, MAIL_SERVICE_PASSWORD } from '../appconfig'
import nodemailer from 'nodemailer';

export default ({to,link}) => {
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'mail.cryptospacex.com',
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
        let mailOptions = {
            from: '"shubham contact" <'+MAIL_SERVICE_MAIL+'>', // sender address
            to: to, // list of receivers
            subject: 'first mail from nodemailer', // Subject line
            text: 'Open link to set password', // plain text body
            html: `This is your link to<br/>
                click to set password<br/>
                <h1>${link}</a></h1>` // html body
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