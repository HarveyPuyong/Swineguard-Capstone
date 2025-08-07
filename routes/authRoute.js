const express = require('express');
const router = express.Router();
const otpController = require('./../controllers/otpController')
const clientAuth = require('./../controllers/authController/signupClientController')

router.post('/client-login', require('./../controllers/authController/loginClientController'));
router.post('/client-signup', clientAuth.signupClientController);
router.post('/admin-login', require('./../controllers/authController/loginAdminController'));

router.post('/send-otp', otpController.sendOtpController); // Send OTP
router.post('/verify-otp', otpController.verifyOTP); // Verify OTP


module.exports = router;
