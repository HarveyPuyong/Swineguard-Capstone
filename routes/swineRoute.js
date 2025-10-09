const express = require('express');
const router = express.Router();
const swineController = require('./../controllers/swineController');
const upload = require('./../middlewares/upload'); 

router.post('/add', swineController.addSwine); // Add Swine

router.post('/add/montly-swine-records', swineController.saveSwineMonthlyRecords); // Save swine montly records

router.post('/add/swine-population', swineController.addSwinePopulation); // Add swine population

router.post('/save/monthly-records', swineController.saveMultipleSwineMonthlyRecords); // Save swine montly records

router.get('/get/montly-swine-records', swineController.getSwineMontlyRecords); // Get swine montly records

router.get('/get/montly-swine-population', swineController.getSwinePopulations); // Get swine montly population

router.put('/edit/:id', upload.single('swineProfileImage'), swineController.editSwine); // Edit Swine

router.patch('/remove/:id', swineController.removeSwine); // Remove Swine

router.patch('/restore/:id', swineController.restoreSwine); // Restore Swine

router.delete('/delete/:id', swineController.deleteSwine); // Delete Swine

router.get('/all', swineController.getSwine); // Get Swines

router.get('/:id', swineController.getSwineById); // Get Swine by Id

router.put('/update/swine-type', swineController.updateSwineTypes) // update the swine type

router.put('/update/swine-type/user/:id', swineController.updateUserSwineTypes) // update the user swine type

router.patch('/is-under/monitoring', swineController.underMonitoringSwines) // update swines as under monitoring

router.patch('/update/is-under/monitoring', swineController.underMonitoringSwinesSecondAction) // update swines as under monitoring

router.put('/update/swine/status/:id', swineController.updateSwineStatus) // update swines as under monitoring

module.exports = router;