const otpModel = require('../models/otpModel');
const nodemailer = require('nodemailer');

exports.sendOtpController = async (req, res) => {
  const email = req.body.email?.trim();

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const existingUser = await otpModel.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already in use' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await otpModel.findOneAndUpdate(
      { email },
      { email, otp, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

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


exports.verifyOTP = async(req, res) => {

  try {
    const { email, otp } = req.body;

    const existingOTP = await otpModel.findOne({ email });

    if (!existingOTP) {
      return res.status(400).json({ message: 'OTP not found. Please request again.' });
    }

    if (existingOTP.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Optional: Check expiry
    const now = new Date();
    if (existingOTP.expiresAt < now) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    return res.status(200).json({ message: 'OTP verified.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error verifying OTP.' });
  }
}