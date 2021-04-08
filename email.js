//email
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

exports.sendEmail = (subject, body) => {
    // console.log('sendEmail');
    const mailOptions = {
        from: 'RM Funds',
        to: process.env.MAIL_TO,
        subject: process.env.ENVNAME+subject,
        html: '<!DOCTYPE html>'+
              '<html><head><title>Funds</title></head>'+
              '<body>'+
              '<h4>Funds</h4>'+
              '<pre>'+body+'</pre>'+
              '</body></html>'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log('Email error: ',error);
      } else {
          console.log(new Date()+'Email sent: ' + info.response);
      }
    });    
}