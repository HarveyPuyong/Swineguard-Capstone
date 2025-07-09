const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const verifyJWT = require('./../middlewares/verifyJWT');
const ROLE_LIST = require('./../config/role_list');
const verifyRoles = require('./../middlewares/verifyRoles');

router.post('/add', verifyJWT, inventoryController.AddItem); // Add items http://localhost:2500/inventory/add
router.put('/edit/:id', verifyJWT, inventoryController.editItem); // Edit items http://localhost:2500/inventory/edit/id
router.patch('/remove/:id', verifyJWT, inventoryController.removeItem); // Remove items http://localhost:2500/inventory/remove/id
router.patch('/restore/:id', verifyJWT, inventoryController.restoreItem); // Restore items http://localhost:2500/inventory/restore/id
router.delete('/delete/:id', verifyJWT,  inventoryController.deleteItem); // Delete items http://localhost:2500/inventory/delete/id
router.get('/all', verifyJWT, inventoryController.getAllItem); // Get all items http://localhost:2500/inventory/all
router.get('/:id', verifyJWT, inventoryController.getItemId); // Get items id http://localhost:2500/inventory/:id

module.exports = router;

// Ito ay para sa Edit:
// {
//     "itemName": "Iron Dextran-100",
//     "dosage": "100",
//     "quantity": "150",
//     "expiryDate": "10-12-2037",
//     "description": "Iron Supplement",
//     "createdBy": "684c6cb98b6b69f642d4289f"
// }

//Ito naman ay sa Add:
// {
//     "itemName": "Iron Dextran-100",
//     "dosage": "100",
//     "quantity": "150",
//     "expiryDate": "10-12-2037",
//     "description": "Iron Supplement",
//     "createdBy": "684c6cb98b6b69f642d4289f"
// }