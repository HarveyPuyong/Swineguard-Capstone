const express = require('express');
const router = express.Router();
const swineController = require('./../controllers/swineController');

router.post('/add', swineController.addSwine); // Add Swine

router.post('/add/montly-swine-records', swineController.saveSwineMonthlyRecords); // Save swine montly records

router.post('/add/swine-population', swineController.addSwinePopulation); // Add swine population

router.post('/save/monthly-records', swineController.saveMultipleSwineMonthlyRecords); // Save swine montly records

router.get('/get/montly-swine-records', swineController.getSwineMontlyRecords); // Get swine montly records

router.get('/get/montly-swine-population', swineController.getSwinePopulations); // Get swine montly population

router.put('/edit/:id', swineController.editSwine); // Edit Swine

router.patch('/remove/:id', swineController.removeSwine); // Remove Swine

router.patch('/restore/:id', swineController.restoreSwine); // Restore Swine

router.delete('/delete/:id', swineController.deleteSwine); // Delete Swine

router.get('/all', swineController.getSwine); // Get Swines

router.get('/:id', swineController.getSwineById); // Get Swine by Id

module.exports = router;