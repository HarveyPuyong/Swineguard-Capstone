const express = require('express');
const router = express.Router();

router.post('/client-login', require('./../controllers/authController/loginClientController'));
router.post('/client-signup', require('./../controllers/authController/signupClientController'));
router.post('/admin-login', require('./../controllers/authController/loginAdminController'));


module.exports = router;