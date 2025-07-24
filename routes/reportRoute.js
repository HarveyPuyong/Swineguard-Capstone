const express = require('express');
const router = express.Router();
const reportController = require('./../controllers/generateReportController');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLE_LIST = require('./../config/role_list');

router.post('/save', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.saveMonthlyReport);
router.get('/get/all', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.getMonthlyReport);

module.exports = router