const mongoose = require('mongoose');

// --- Swine Report Schema ---
const reportItemSchema = new mongoose.Schema({
  municipality: { type: String, required: true },
  barangay: { type: String, required: true },
  total: { type: Number, default: 0 },
  piglet: { type: Number, default: 0 },
  grower: { type: Number, default: 0 },
  sow: { type: Number, default: 0 },
  boar: { type: Number, default: 0 }
});

const monthlySwineReportSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  swineData: [reportItemSchema]
}, {
  collection: 'reports',
  timestamps: true 
});

// Enforce uniqueness on (month, year)
monthlySwineReportSchema.index({ month: 1, year: 1 }, { unique: true });

const SwineReport = mongoose.model('MonthlySwineReport', monthlySwineReportSchema);


// --- Inventory Report Schema ---
const inventoryItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  itemType: { type: String, required: true },
  dosage: { type: Number, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  itemStatus: { type: String, required: true },
  description: { type: String }
}, { _id: false });

const inventoryReportSchema = new mongoose.Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  inventoryData: [inventoryItemSchema]
}, {
  collection: 'inventoryReports',
  timestamps: true
});

const InventoryReport = mongoose.model('InventoryReport', inventoryReportSchema);


// --- Exports ---

module.exports = {
  SwineReport,
  InventoryReport
};


