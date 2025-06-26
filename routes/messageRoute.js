const express = require('express');
const router = express.Router();
const messageController = require('./../controllers/messageController');

//const verifyJWT = require('../middlewares/verifyJWT'); Saka mo na ito paganahin sa front end mo sa header at authorization mo

router.post('/send', verifyJWT, messageController.sendMessage);
router.get('/user/:id', verifyJWT, messageController.getUserMessages);// Get user messages
router.get('/all', verifyJWT, verifyRoles(ROLE_LIST.Admin,
                                         ROLE_LIST.AppointmentCoordinator,
                                         ROLE_LIST.InventoryCoordinator), 
                                         messageController.getMessages);

module.exports = router