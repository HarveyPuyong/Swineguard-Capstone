const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const verifyJWT = require('./../middlewares/verifyJWT');
const ROLE_LIST = require('./../config/role_list');
const verifyRoles = require('./../middlewares/verifyRoles');



router.post('/add/medicine', verifyJWT, verifyRoles(ROLE_LIST.InventoryCoordinator), inventoryController.AddMedicine); // Add medicine Name

router.post('/add/item', verifyJWT, verifyRoles(ROLE_LIST.InventoryCoordinator), inventoryController.AddItem); // Add Item

router.put('/add/stock/:id', verifyJWT, verifyRoles(ROLE_LIST.InventoryCoordinator), inventoryController.addStock); // Add Stocks

router.put('/edit/stock/:id', verifyJWT, verifyRoles(ROLE_LIST.InventoryCoordinator), inventoryController.editStock); 

router.get('/all/medicines', verifyJWT,  inventoryController.getAllMedicine);  // Get all Medicine

router.get('/all/items', verifyJWT,  inventoryController.getAllItem); // get all Item


module.exports = router;
