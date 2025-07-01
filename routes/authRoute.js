const express = require('express');
const router = express.Router();

router.post('/client-login', require('./../controllers/authController/loginClientController'));
router.post('/client-signup', require('./../controllers/authController/signupClientController'));
router.post('/admin-login', require('./../controllers/authController/loginAdminController'));


module.exports = router;

// {
//     "firstName": "John 😊",
//     "middleName": "X",
//     "lastName": "Doe",
//     "suffix": "",

//     "birthday": "10-10-1990",
//     "contactNum": "09123456789",
//     "barangay": "Santol",
//     "municipality": "Boac",

//     "email": "doe@gmail.com",
//     "password": "123456789",
//     "confirmPassword": "123456789"
// }