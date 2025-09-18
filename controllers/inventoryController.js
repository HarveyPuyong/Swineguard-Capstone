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





// Edit Items
exports.editItem = async (req, res) => {
    const { id } = req.params;
    const { itemName, dosage, quantity, expiryDate, description, createdBy } = req.body;

    // Validate object Id
    if (!checkItemId(id)) return res.status(400).json({ message: "Invalid Item ID." });

    // Validate input fields
    if ([itemName, dosage, quantity, expiryDate, description, createdBy].some(field => field === undefined || field === null)) {
        return res.status(400).json({ message: 'Kindly check your item details' });
    }

    // Check for emojis in itemName and description
    if (isInvalidInput(itemName, description)) return res.status(400).json({ message: 'Item name and description must not be empty or contain emojis.' });

    // Validate dosage and numbers
    if(!isValidNumber(dosage)) return res.status(400).json({ message: 'Item dosage and quantity must be valid numbers and greater than 0' });


    const numericDosage = Number(dosage);
    const numericQuantity = Number(quantity);

    // Check Expiration Date
    if (checkExpiryDate(expiryDate)) return res.status(400).json({ message: 'Past and current year are not allowed for expiration date.' });
       
    // Object of Item details
    const itemDetails = {itemName, dosage: numericDosage, quantity: numericQuantity, expiryDate: new Date(expiryDate), description, createdBy};

    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            id,
            { ...itemDetails },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        return res.status(200).json({
            message: 'Item updated successfully.',
            item: updatedItem
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({
            message: 'Something went wrong while updating item.'
        });
    }
};


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

// Get Item Id
exports.getItemId = async (req, res) => {
    const { id } = req.params;
    // if (checkItemId(id)) return res.status(400).json({ message: 'Invalid item Id' })
    try {
        const existingItem = await Inventory.findById(id);
        if (!existingItem) return res.status(404).json({ message: 'Item not found.' });
        res.status(200).json(existingItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// updated item quantity
exports.updateItemQuantity = async (req, res) => {
  const { id } = req.params; // inventory item ID
  const { appointmentId } = req.body; // passed from frontend

  try {
    // 1. Find the inventory item
    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found.' });
    }

    const itemDosagePerUnit = Number(item.dosage); // e.g., 100 mg
    const currentQuantity = Number(item.quantity);

    // 2. Get the specific appointment being completed
    const appointment = await appointmentDB.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // 3. Get the dosage from this appointment
    const dosage = parseFloat(appointment.dosage);
    if (isNaN(dosage)) {
      return res.status(400).json({ message: 'Invalid dosage in appointment.' });
    }

    // 4. Calculate units used and subtract
    const unitsUsed = dosage / itemDosagePerUnit;
    const updatedQuantity = Math.max(currentQuantity - unitsUsed, 0);

    // 5. Save the updated quantity
    await Inventory.findByIdAndUpdate(id, { quantity: updatedQuantity });

    res.status(200).json({
      message: 'Item quantity updated successfully.',
      dosageUsed: dosage,
      unitsUsed,
      updatedQuantity
    });

  } catch (err) {
    console.error(`Error updating item quantity: ${err}`);
    res.status(500).json({ message: 'Server error while updating item quantity.' });
  }
};

// Check item Id
function checkItemId (id) {
    return mongoose.Types.ObjectId.isValid(id);
}