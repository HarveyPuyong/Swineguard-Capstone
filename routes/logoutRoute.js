const express = require('express');
const router = express.Router();

router.post('/', require('./../controllers/authController/logoutController'));

module.exports = router;
