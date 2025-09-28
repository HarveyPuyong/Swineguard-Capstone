const mongoose = require('mongoose');

// --- Swine Report Schema ---
const reportItemSchema = new mongoose.Schema({
  municipality: { type: String, required: true },
  barangay: { type: String, required: true },
  raisersCount: { type: Number, default: 0 },
  maleRaisers: { type: Number, default: 0 },  
  femaleRaisers: { type: Number, default: 0 }, 
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

monthlySwineReportSchema.index({ month: 1, year: 1 }, { unique: true });

const SwineReport = mongoose.model('MonthlySwineReport', monthlySwineReportSchema);


// --- Inventory Report Schema ---
const inventoryItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  totalQuantity: { type: Number, required: true },
  usedAmount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  status: { type: String, required: true }
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


