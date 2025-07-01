const express = require('express');
const router = express.Router();
const messageController = require('./../controllers/messageController');
const ROLE_LIST = require('./../config/role_list');
const verifyRoles = require('./../middlewares/verifyRoles');
const verifyJWT = require('./../middlewares/verifyJWT');


router.post('/send', verifyJWT, messageController.sendMessage);
router.get('/user/:id', verifyJWT, messageController.getUserMessages);// Get user messages
router.get('/all', verifyJWT, verifyRoles(ROLE_LIST.Admin,
                                         ROLE_LIST.AppointmentCoordinator,
                                         ROLE_LIST.InventoryCoordinator), 
                                         messageController.getMessages);

module.exports = router