const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/add', inventoryController.AddItem);
//router.put('/edit', inventoryController)

module.exports = router;