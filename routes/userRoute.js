const express = require('express');
const router = express.Router();
const ROLE_LIST = require('./../config/role_list');
const verifyRoles = require('./../middlewares/verifyRoles');
const verifyJWT = require('./../middlewares/verifyJWT');



router.post('/add/technician', userController.addTechnician); // Add Technicians
router.put('/edit/:id', userController.editUserDetails);// Edit user details
router.get('/data', userController.fetchUserData); // Get all user details

router.get('/client-profile', verifyJWT, require('../controllers/getUsersController'));


router.get('/admin-profile', verifyJWT, verifyRoles(ROLE_LIST.Admin,
                                         ROLE_LIST.AppointmentCoordinator,
                                         ROLE_LIST.InventoryCoordinator),
                                        require('../controllers/getUsersController'));

module.exports = router;