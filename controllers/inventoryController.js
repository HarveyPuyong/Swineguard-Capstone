//const Inventory = require('../models/inventoryModel');
const { Inventory, InventoryStock } = require('../models/inventoryModel');
const appointmentDB = require('../models/appointmentModel');

const mongoose = require('mongoose');
const {isValidNumber, isInvalidInput, checkExpiryDate} = require('./../utils/inventoryUtils');


//Add Medicine Name Main
exports.AddMedicine = async (req, res) => {
    const { itemName } = req.body;

    if (isInvalidInput(itemName)) {
        return res.status(400).json({ message: 'Medicine name must not contain emoji' });
    }

    try {
        // Check if the medicine already exists (case-insensitive)
        const existing = await Inventory.findOne({ itemName: new RegExp(`^${itemName}$`, 'i') });
        if (existing) {
        return res.status(409).json({ message: 'Medicine name already exists.' });
        }

        // Create new medicine document
        const newMedicine = new Inventory({ itemName });
        await newMedicine.save();

        return res.status(201).json({
        message: "Medicine added successfully.",
        item: newMedicine
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({
        message: 'Something went wrong while adding medicine.'
        });
    }
};


// Add Item to the collections
exports.AddItem = async (req, res) => {
  try {
    const { medicineId, content, quantity, expiryDate } = req.body;

    // Empty check
    const itemData = { medicineId, content, quantity, expiryDate };
    const hasEmpty = Object.values(itemData).some(v => v === undefined || v === null || v === "");
    if (hasEmpty) {
      return res.status(400).json({ message: "itemData contains empty fields", itemData });
    }

    // Validate content/quantity
    if (!isValidNumber(content) || !isValidNumber(quantity)) {
      return res.status(400).json({ message: "Item content and quantity must be numbers > 0" });
    }

    // Validate expiry
    if (!checkExpiryDate(expiryDate)) {
      return res.status(400).json({ message: "Expiration must be a future date" });
    }

    // Convert to numbers
    const numericContent = Number(content);
    const numericQuantity = Number(quantity);

    // Find existing
    const existingItem = await InventoryStock.findOne({ medicineId, content: numericContent, expiryDate });
    if (existingItem) {
      existingItem.quantity += numericQuantity;
      await existingItem.save();
      return res.status(200).json({ message: "Item already exists. Quantity updated.", item: existingItem });
    }

    // Create new
    const newItem = new InventoryStock({ medicineId, content: numericContent, quantity: numericQuantity, expiryDate });
    await newItem.save();

    return res.status(201).json({ message: "New item added successfully.", item: newItem });
  } catch (err) {
    console.error("Error while adding item:", err);
    return res.status(500).json({ message: "Something went wrong while adding new Item.", error: err.message });
  }
};

// Add Stock
exports.addStock = async (req, res) => {
  try {

    const { id } = req.params;
    const { quantity } = req.body;

    // Validate content/quantity
    if (!isValidNumber(quantity)) {
      return res.status(400).json({ message: "Item quantity must be numbers > 0" });
    }

    const numericQuantity = Number(quantity);

    const updatedStock = await InventoryStock.findByIdAndUpdate(
      id,
      { $inc: { quantity: numericQuantity }},
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found." });
    }

    return res.status(200).json({
            message: 'Stock added successfully.',
            item: updatedStock
    });

  } catch (err) {
    console.error("Error while adding item:", err);
    return res.status(500).json({ message: "Something went wrong while adding stocks.", error: err.message });
  }
}


// Edit Stock
exports.editStock = async (req, res) => {
  try {

    const { id } = req.params;
    const { quantity, content } = req.body;

    // Validate content/quantity
    if (!isValidNumber(quantity) || !isValidNumber(content)) {
      return res.status(400).json({ message: "Item quantity & content must be numbers > 0" });
    }

    const numericQuantity = Number(quantity);
    const numericContent = Number(content);

    const itemData = { quantity: numericQuantity, content: numericContent }

    const updatedStock = await InventoryStock.findByIdAndUpdate(
      id,
      itemData,
      { new: true }
    );

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found." });
    }

    return res.status(200).json({
            message: 'Stock updated successfully.',
            item: updatedStock
    });

  } catch (err) {
    console.error("Error while adding item:", err);
    return res.status(500).json({ message: "Something went wrong while updating stocks.", error: err.message });
  }
}


// Get All Medicine
exports.getAllMedicine = async (req, res) => {
    try {
        const items = await Inventory.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Medicine
exports.getAllItem = async (req, res) => {
    try {
        const items = await InventoryStock.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Check item Id
function checkItemId (id) {
    return mongoose.Types.ObjectId.isValid(id);
}