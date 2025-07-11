const express = require('express');
const router = express.Router();
const ROLE_LIST = require('./../config/role_list');
const verifyRoles = require('./../middlewares/verifyRoles');
const verifyJWT = require('./../middlewares/verifyJWT');
const {editUserDetails, addTechnician, addVeterinarian, addStaff, getTechandVets, getAllStaffs } = require('./../controllers/userController');
const {getUsers, getUser, getUserById} = require('./../controllers/getUsersController')

// Parang d na yata ito kelangan pati yung add vet, pwede yatang add staff na lang: ako na gumawa ng add staff 
// router.post('/add/technician', verifyJWT,  verifyRoles(ROLE_LIST.Admin), addTechnician);
// router.post('/add/veterinarian', verifyJWT,  verifyRoles(ROLE_LIST.Admin), addVeterinarian); 

router.post('/add/staff', verifyJWT,  verifyRoles(ROLE_LIST.Admin), addStaff);

router.get('/get/technician', verifyJWT,  verifyRoles(ROLE_LIST.AppointmentCoordinator), getTechandVets); // For appointments personnels
router.get('/get/user/:id', verifyJWT,  verifyRoles(ROLE_LIST.AppointmentCoordinator), getUserById); // For selected personnels

router.get('/get/staff', verifyJWT,  verifyRoles(ROLE_LIST.Admin), getAllStaffs); // For All personnels

router.put('/edit/:id', verifyJWT, editUserDetails);

router.get('/users',verifyJWT, getUsers); 

router.get('/client-profile', verifyJWT, getUser);

router.get('/admin-profile', verifyJWT, verifyRoles(ROLE_LIST.Admin,
                                         ROLE_LIST.AppointmentCoordinator,
                                         ROLE_LIST.InventoryCoordinator),
                                         getUser);

module.exports = router;