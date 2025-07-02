const express = require('express');
const router = express.Router();
const appointmentController = require('./../controllers/appointmentController');
const verifyJWT = require('./../middlewares/verifyJWT');

//CRUD Operation
router.post('/add', verifyJWT, appointmentController.addAppointment); // Add appointments
router.put('/accept/:id', verifyJWT, appointmentController.acceptAppointment); // Accepting appointments
router.patch('/reschedule/:id', verifyJWT, appointmentController.rescheduleAppointment); // Rescheduling appointments
router.patch('/remove/:id', verifyJWT, appointmentController.removeAppointment); // Removing appointments
router.patch('/restore/:id', verifyJWT, appointmentController.restoreAppointment); // Restoring appointments
router.patch('/complete/:id', verifyJWT, appointmentController.completeAppointment); // Compelting appointments
router.delete('/delete/:id', verifyJWT, appointmentController.deleteAppointment); // Deleting appointments
router.get('/all', appointmentController.getAllAppointments); //Get all Appointments

module.exports = router;

//http://localhost:2500/appointment/add ng appointment a copy paste mo dito 
//  {   
//     "clientName": "Robert Sakamoto",
//     "contactNum": "09266495922",
//     "municipality": "Gasan",
//     "barangay": "Mahunig",

//     "appointmentTitle": "Iron Supplement",
//     "swineType": "Piglet",
//     "swineCount": 1,
//     "swineSymptoms": "3 days of being born",
//     "swineAge": 0,
//     "swineMale": 0,
//     "swineFemale": 1,

//     "appointmentDate": "06-24-2025",
//     "appointmentTime": "09:30",
//     "appointmentType": "service"
// }

//Ito yung mga link kupal Put ang gamit sa accept marami kase mababago sa loob
//http://localhost:2500/appointment/accept/id ng appointment a copy paste mo dito 

//ganto itsura ng url sa testing
//http://localhost:2500/appointment/accept/684fe1b50bafb6af4c9043bb
// {
//     "appointmentDate": "06-24-2025",
//     "appointmentTime": "07:30",
//     "appointmentType": "service",
//     "vetPersonnel": "Dr. Kupal Cruz",
//     "medicine": "Ivermectin",
//     "dosage": "100",
//     "vetMessage": "Kupal ka ba Boss?"
// }

// dito ay Patch ang gamit wala ka nang ilalagay sa body nito rekta change na agad yung status sa backend nito para iwas gamit ng dev tools sa webs
//http://localhost:2500/appointment/reschedule/:id 
//http://localhost:2500/appointment/remove/:id 
//http://localhost:2500/appointment/restore/:id
//http://localhost:2500/appointment/complete/:id
//http://localhost:2500/appointment/delete/:id