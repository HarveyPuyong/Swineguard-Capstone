const User = require('./../models/userModel');
const nodemailer = require('nodemailer');

const sendOtpController = async (req, res) => {
  const email = req.body.email?.trim();

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already in use' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // generate 4-digit
    const otpExpires = Date.now() + 5 * 60 * 1000; // valid for 5 mins

    // Store temporarily in DB
    let tempUser = await User.findOneAndUpdate(
      { email },
      { email, otp, otpExpires},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"SwineGuard Verification" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your SwineGuard verification code is ${otp}`,
    });

    return res.status(200).json({ message: 'OTP sent successfully to your email.' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to send OTP.', error: err.message });
  }
};

module.exports = sendOtpController;
