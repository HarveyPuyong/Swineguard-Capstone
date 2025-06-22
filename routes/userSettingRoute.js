const express = require('express');
const router = express.Router();

const userController = require('./../controllers/userController');

router.put('/edit/:id', userController.editUserDetails);

module.exports = router;

// Ganto yung format sa postman
// http://localhost:2500/user/edit/684ab883fc011ae126d42962

// {
//     "firstName": "Taro", 
//     "middleName": "X", 
//     "lastName": "Sakamoto", 
//     "suffix": "",
//     "contactNum": "09488854769", 
//     "barangay": "Tokyo", 
//     "municipality": "Japan",
//     "email": "sakamoto@gmail.com", 
// }