const express = require('express');
const router = express.Router();
const notificationController = require('./../controllers/notification-controller');
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/send', verifyJWT, notificationController.sendNotification);
//router.get('/user/:id', verifyJWT, notificationController.getUserMessages);// Get user messages
router.get('/all', verifyJWT,  notificationController.getNotification);

module.exports = router