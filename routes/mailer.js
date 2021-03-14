let nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
                                                   service: 'gmail',
                                                   auth: {
                                                       user: 'voicebank2000@gmail.com',
                                                       pass: process.env.MAIL_PASSWORD
                                                   }
                                               });

const mailOptions = {
    from: 'voicebank2000@gmail.com',
    to: '',
    subject: 'sprachbank',
    text: 'That was easy!'
};

const sendNotification = () => {

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

};

module.exports = sendNotification;
