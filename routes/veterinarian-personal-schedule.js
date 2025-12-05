const express = require('express');
const router = express.Router();
const vetPersonalSchedController = require('./../controllers/vetPersonalScheduleController');

router.post('/vet/personal-sched/:id', vetPersonalSchedController.addNewVetSchedule); // Add new schedule from the Calendar

router.get('/get/vet/personal-sched/', vetPersonalSchedController.getVetSchedule); // Get schedule from the Calendar

router.put('/edit/vet/personal-sched/:id', vetPersonalSchedController.editVetSchedule); // Edit schedule from the Calendar

router.delete('/delete/vet/personal-sched/:id', vetPersonalSchedController.deleteVetSchedule); // Edit schedule from the Calendar

router.put('/edit/vet/total-num-of-app/:id', vetPersonalSchedController.editNUmberOfAppointmentsPerDay); // Get schedule from the Calendar

router.post('/set/vet/total-num-of-app', vetPersonalSchedController.setNUmberOfAppointmentsPerDay); // Get schedule from the Calendar

router.get('/get/vet/total-num-of-app/', vetPersonalSchedController.getNUmberOfAppointmentsPerDay); // Get schedule from the Calendar

module.exports = router;