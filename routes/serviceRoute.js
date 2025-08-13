const express = require('express');
const router = express.Router();
const { addServices, editServices, getAllServices, getServiceById } = require('./../controllers/serviceController');
const verifyRoles = require('./../middlewares/verifyRoles');
const ROLE_LIST = require('./../config/role_list');
const verifyJWT = require('./../middlewares/verifyJWT');

router.post('/add', verifyJWT,  verifyRoles(ROLE_LIST.Admin), addServices); // Add services
router.put('/edit/:id',verifyJWT, editServices); // Edit services name and description
router.get('/get/all',verifyJWT, getAllServices); // Get all services
router.get('/get/:id',verifyJWT, getServiceById); // Get service by Id

module.exports = router;