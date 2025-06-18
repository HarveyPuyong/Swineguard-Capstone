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

//http://localhost:2500/appointment/add ng appointment a copy paste mo dito 
//  {   "clientName": "Shin Asakura",
//     "contactNum": "09266495922",
//     "municipality": "Boac",
//     "barangay": "Santol",

//     "appointmentTitle": "Iron Supplement",
//     "swineType": "Piglet",
//     "swineCount": 4,
//     "swineSymptoms": "3 days of being born",
//     "swineAge": "0",
//     "swineMale": 3,
//     "swineFemale": 1,

//     "appointmentDate": "10-10-2025",
//     "appointmentTime": "11:00"}

//Ito yung mga link kupal Put ang gamit sa accept marami kase mababago sa loob
//http://localhost:2500/appointment/accept/id ng appointment a copy paste mo dito 

//ganto itsura ng url sa testing
//http://localhost:2500/appointment/accept/684fe1b50bafb6af4c9043bb

// { para sa accept ito ah
//     "appointmentDate": "09-09-2025",
//     "appointmentTime": "10:30",
//     "appointmentStatus": "ongoing",
//     "vetPersonnel": "Dr. Dela Cruz",
//     "medicine": "Ivermectin",
//     "dosage": "100",
//     "vetMessage": "Administer every 12 hours"
// }

// dito ay Patch ang gamit wala ka nang ilalagay sa body nito rekta change na agad yung status sa backend nito para iwas gamit ng dev tools sa webs
//http://localhost:2500/appointment/reschedule/:id 
//http://localhost:2500/appointment/remove/:id 
//http://localhost:2500/appointment/restore/:id
//http://localhost:2500/appointment/complete/:id
//http://localhost:2500/appointment/delete/:id