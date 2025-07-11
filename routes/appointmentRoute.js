const express = require('express');
const router = express.Router();
const appointmentController = require('./../controllers/appointmentController');
const verifyJWT = require('./../middlewares/verifyJWT');
const ROLE_LIST = require('./../config/role_list');
const verifyRoles = require('./../middlewares/verifyRoles');


router.post('/add', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator), appointmentController.addAppointment); 

router.put('/accept/:id', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator), appointmentController.acceptAppointment); 

router.patch('/reschedule/:id', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator), appointmentController.rescheduleAppointment); 

router.patch('/remove/:id', verifyJWT, appointmentController.removeAppointment); 

router.patch('/restore/:id', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator), appointmentController.restoreAppointment);

router.patch('/complete/:id', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator), appointmentController.completeAppointment);

router.delete('/delete/:id', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator), appointmentController.deleteAppointment); 

router.get('/all', appointmentController.getAllAppointments); 

router.get('/:id', verifyJWT, appointmentController.getAppointmentById); 


module.exports = router;

