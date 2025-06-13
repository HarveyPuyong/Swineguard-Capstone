const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

//const verifyJWT = require('../middlewares/verifyJWT'); Saka mo na ito paganahin sa front end mo sa header at authorization mo

router.post('/', messageController);

module.exports = router