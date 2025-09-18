const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const verifyJWT = require('./../middlewares/verifyJWT');
const ROLE_LIST = require('./../config/role_list');
const verifyRoles = require('./../middlewares/verifyRoles');



router.post('/add/medicine', verifyJWT, verifyRoles(ROLE_LIST.InventoryCoordinator), inventoryController.AddMedicine); // Add medicine Name

router.post('/add/item', verifyJWT, verifyRoles(ROLE_LIST.InventoryCoordinator), inventoryController.AddItem); // Add Item

// router.put('/edit/:id', verifyJWT, verifyRoles(ROLE_LIST.InventoryCoordinator), inventoryController.editItem); 

// router.patch('/remove/:id', verifyJWT, verifyRoles(ROLE_LIST.InventoryCoordinator), inventoryController.removeItem); 

// router.patch('/restore/:id', verifyJWT, verifyRoles(ROLE_LIST.InventoryCoordinator), inventoryController.restoreItem); 

// router.delete('/delete/:id', verifyJWT, verifyRoles(ROLE_LIST.InventoryCoordinator),  inventoryController.deleteItem); 

router.get('/all/medicines', verifyJWT,  inventoryController.getAllMedicine); 

router.get('/all/items', verifyJWT,  inventoryController.getAllItem); 

// router.get('/:id', verifyJWT, inventoryController.getItemId);

// router.put('/update-quantity/:id', verifyJWT, inventoryController.updateItemQuantity);

module.exports = router;
