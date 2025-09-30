const express = require('express');
const router = express.Router();
const reportController = require('./../controllers/generateReportController');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRoles = require('../middlewares/verifyRoles');
const ROLE_LIST = require('./../config/role_list');

router.post('/save', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.saveMonthlyReport); // Save swine Report

router.get('/get/all', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.getMonthlyReport); // Get swine Report

router.post('/inventory/save', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.saveInventoryReport); // Save inventory Report

router.get('/inventory/full', verifyJWT, reportController.fetchFullInventory); // Get inventory Report
//router.get('/inventory/full', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.fetchFullInventory); // Get inventory Report

router.get('/inventory/all', verifyJWT, verifyRoles(ROLE_LIST.Admin), reportController.fetchInventoryReport); // Get inventory Report

module.exports = router