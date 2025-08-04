// test-email.js
const sendOTP = require('./../controllers/sendOtpController'); // adjust the path
require('dotenv').config(); // Make sure to load .env

const test = async () => {
  const testEmail = 'magnorobert86@gmail.com'; // Use an email you can check
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    await sendOTP(testEmail, otp);
    console.log('✅ Email sent successfully! OTP:', otp);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};
