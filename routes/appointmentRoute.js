const express = require('express');
const router = express.Router();
const appointmentController = require('./../controllers/appointmentController');
const verifyJWT = require('./../middlewares/verifyJWT');
const ROLE_LIST = require('./../config/role_list');
const verifyRoles = require('./../middlewares/verifyRoles');


router.post('/add', verifyJWT, appointmentController.addAppointment); 

router.put('/accept/:id', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator), appointmentController.acceptAppointment); 

router.patch('/monitoring/:id', verifyJWT, appointmentController.underMonitoringAppointment); // Under Monitoring

router.put('/reschedule/:id', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator), appointmentController.rescheduleAppointment); 

router.patch('/remove/:id', verifyJWT, appointmentController.removeAppointment); 

router.patch('/restore/:id', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator), appointmentController.restoreAppointment);

router.patch('/complete/:id', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator, ROLE_LIST.Veterinarian, ROLE_LIST.Technician), appointmentController.completeAppointment);

router.delete('/delete/:id', verifyJWT, verifyRoles(ROLE_LIST.AppointmentCoordinator), appointmentController.deleteAppointment); 

router.get('/all', appointmentController.getAllAppointments); 

router.get('/all/return/4-digit-id', appointmentController.getAllAppointmentsWithFourDigitId); 

router.get('/:id', verifyJWT, appointmentController.getAppointmentById); 


module.exports = router;

