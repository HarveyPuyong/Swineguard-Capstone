const express = require('express');
const router = express.Router();
const messageController = require('./../controllers/messageController');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLE_LIST = require('./../config/role_list')

router.post('/send', verifyJWT, messageController.sendMessage);
router.get('/user/:id', verifyJWT, messageController.getUserMessages);// Get user messages
router.get('/all', verifyJWT, verifyRoles(ROLE_LIST.Admin,
                                         ROLE_LIST.AppointmentCoordinator,
                                         ROLE_LIST.InventoryCoordinator,
                                         ROLE_LIST.Veterinarian), 
                                         messageController.getMessages);

module.exports = router