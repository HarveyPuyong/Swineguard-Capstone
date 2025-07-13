const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate a 4-digit number OTP
const otp = Math.floor(1000 + Math.random() * 9000).toString();

// Save this OTP with the user's email in the DB (temporarily)
const newUser = new User({
  email: req.body.email,
  password: hashedPassword,
  otp: otp,
  otpExpires: Date.now() + 10 * 60 * 1000 // OTP valid for 10 mins
});
await newUser.save();

// Send OTP via email
const transporter = nodemailer.createTransport({ /* SMTP config */ });

await transporter.sendMail({
  from: 'youremail@example.com',
  to: req.body.email,
  subject: 'Your OTP Code',
  text: `Your OTP is ${otp}`
});