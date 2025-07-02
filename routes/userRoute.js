const express = require('express');
const router = express.Router();
const ROLE_LIST = require('./../config/role_list');
const verifyRoles = require('./../middlewares/verifyRoles');
const verifyJWT = require('./../middlewares/verifyJWT');
const userController = require('./../controllers/userController');



router.post('/add/technician', verifyJWT, userController.addTechnician); // Add Technicians
router.put('/edit/:id', verifyJWT, userController.editUserDetails);// Edit user details

router.get('/data',verifyJWT, userController.fetchUserData); // Get all user details

router.get('/client-profile', verifyJWT, require('../controllers/getUsersController'));


router.get('/admin-profile', verifyJWT, verifyRoles(ROLE_LIST.Admin,
                                         ROLE_LIST.AppointmentCoordinator,
                                         ROLE_LIST.InventoryCoordinator),
                                        require('../controllers/getUsersController'));

module.exports = router;