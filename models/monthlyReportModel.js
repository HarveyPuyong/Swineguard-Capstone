const mongoose = require('mongoose');

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
  generatedAt: { type: Date, default: Date.now },
  swineData: [reportItemSchema]

}, { collection: 'reports', timestamps: true });

// Add this line to enforce uniqueness
monthlySwineReportSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MonthlySwineReport', monthlySwineReportSchema);