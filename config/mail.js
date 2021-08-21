var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fdmxfarhan@gmail.com',
    pass: 'llolqibvcnwvzhjp'
  }
});

module.exports = (to, subject, html) => {
    var mailOptions = {
        from: 'fdmxfarhan@gmail.com',
        to: to,
        subject: subject,
        text: html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}