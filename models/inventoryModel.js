const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({

    itemName: { type: String, required: true },
    dosage: { type: Number, required: true },
    quantity: { type: Number, required: true },

    expiryDate: { type: Date, required: true },
    itemStatus: { type: String, default: 'In Stock' },

    description: { type: String, required: true },
    itemType: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    
}, { collection: 'inventories', timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);