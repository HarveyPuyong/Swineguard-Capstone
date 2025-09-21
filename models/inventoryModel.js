const mongoose = require('mongoose');

// Main inventory items (e.g., "Ivermectin", "Amoxicillin")
const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true }
}, { collection: 'inventoryItems', timestamps: true });

const Inventory = mongoose.model('Inventory', inventorySchema);

// Stocks for each inventory item (different dosages/expiry dates)
const inventoryStockSchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  content: { type: Number, required: true },  
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: true }
}, { collection: 'inventoryStocks', timestamps: true });

const InventoryStock = mongoose.model('InventoryStock', inventoryStockSchema);

module.exports = { Inventory, InventoryStock };