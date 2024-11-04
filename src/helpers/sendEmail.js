const nodemailer = require('nodemailer');

const sendEmail = async ({ userEmail, userPass, recipientEmail, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: userEmail, 
      pass: userPass,  
    },
  });

  const mailOptions = {
    from: userEmail,
    to: recipientEmail, 
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

module.exports = sendEmail;
