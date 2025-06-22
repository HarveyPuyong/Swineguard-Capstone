const express = require('express');
const router = express.Router();

router.post('/logout', require('./../controllers/authController/logoutController'));

module.exports = router;
