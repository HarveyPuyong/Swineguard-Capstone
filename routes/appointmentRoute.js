const express = require('express');
const router = express.Router();
const appointmentController = require('./../controllers/appointmentController');

//CRUD Operation
router.post('/add', appointmentController.addAppointment); // Add appointments
router.put('/accept/:id', appointmentController.acceptAppointment); // Accepting appointments
router.patch('/reschedule/:id', appointmentController.rescheduleAppointment); // Rescheduling appointments
router.patch('/remove/:id', appointmentController.removeAppointment); // Removing appointments
router.patch('/restore/:id', appointmentController.restoreAppointment); // Restoring appointments
router.patch('/complete/:id', appointmentController.completeAppointment); // Compelting appointments
router.delete('/delete/:id', appointmentController.deleteAppointment); // Deleting appointments
router.get('/all', appointmentController.getAllAppointments); //Get all Appointments

module.exports = router;

