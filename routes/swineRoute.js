const express = require('express');
const router = express.Router();
const swineController = require('./../controllers/swineController');

router.post('/add', swineController.addSwine); // Add Swine
router.patch('/edit/:id', swineController.editSwine); // Edit Swine
router.get('/all', swineController.getSwine); // Get Swine

module.exports = router;