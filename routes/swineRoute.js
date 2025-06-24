const express = require('express');
const router = express.Router();
const swineController = require('./../controllers/swineController');

router.post('/add', swineController.addSwine); // Add Swine
router.put('/edit/:id', swineController.editSwine); // Edit Swine
router.patch('/remove/:id', swineController.removeSwine); // Remove Swine
router.patch('/restore/:id', swineController.restoreSwine); // Restore Swine
router.delete('/delete/:id', swineController.deleteSwine); // Delete Swine
router.get('/all', swineController.getSwine); // Get Swine

module.exports = router;

// Edit Swine
// Okay lamang na text ipasa mo dito boit may converter naman sa controller
// http://localhost:2500/swine/edit/:id
// {
//     "type": "Grower", 
//     "weight": "60.5", 
//     "healthStatus": "deceased",
//     "cause": "ASF"
// }

// Add Swine
// http://localhost:2500/swine/add
// {
//     "breed": "Half-Breed",
//     "type": "Grower", 
//     "birthdate": "02-01-2025",
//     "sex": "Male",
//     "weight": "50.3",
//     "clientId": "684c39091634ef96dbba8db4"
// }