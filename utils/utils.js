const nodemailer = require('nodemailer');

module.exports.sendEmail = async options => {
    // create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    // define the email options
    const mailOptions = {
        from: 'Yang Jiang <hello@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    // send!
    await transporter.sendMail(mailOptions);
};
