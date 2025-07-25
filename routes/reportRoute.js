const express = require('express');
const router = express.Router();
const reportController = require('./../controllers/generateReportController');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLE_LIST = require('./../config/role_list');

router.post('/save', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.saveMonthlyReport); // Save swine Report

router.get('/get/all', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.getMonthlyReport); // Get swine Report

router.post('/inventory/save', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.saveInventoryReport); // Save inventory Report

router.get('/get/inventory/all', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.getAllInventoryReports); // Get inventory Report

module.exports = router