const express = require('express');
const router = express.Router();
const messageController = require('./../controllers/messageController');

//const verifyJWT = require('../middlewares/verifyJWT'); Saka mo na ito paganahin sa front end mo sa header at authorization mo

router.post('/send', messageController.sendMessage);
router.get('/user/:id', messageController.getUserMessages);// Get user messages
router.get('/all', messageController.getMessages);

module.exports = router