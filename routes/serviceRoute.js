const express = require('express');
const router = express.Router();
const { addServices, editServices, getAllServices } = require('./../controllers/serviceController');
const verifyRoles = require('./../middlewares/verifyRoles');
const ROLE_LIST = require('./../config/role_list');
const verifyJWT = require('./../middlewares/verifyJWT');

router.post('/add', verifyJWT,  verifyRoles(ROLE_LIST.Admin), addServices); // Add services
router.put('/edit/:id',verifyJWT,  verifyRoles(ROLE_LIST.Admin), editServices); // Edit services name and description
router.get('/get/services',verifyJWT,  verifyRoles(ROLE_LIST.AppointmentCoordinator), getAllServices); // Get all services

module.exports = router;