const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"SwineGuard Verification" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'SwineGuard OTP Verification Code',
    html: `<p>Good day!</p><p>Your verification code is: <strong>${otp}</strong></p><p>It will expire in 5 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTP;