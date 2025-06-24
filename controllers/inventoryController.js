const inventoryDB = require('../models/inventoryModel');
const mongoose = require('mongoose');

//Add Item to the collections
exports.AddItem = async (req, res) => {

    const {itemName, dosage, quantity, expiryDate, description, createdBy} = req.body;
    
    // Check for emojis
    const containsEmoji = (str) => {
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        return emojiRegex.test(str);
    };

    // Check for emojis in itemName and description
    if (containsEmoji(itemName) || containsEmoji(description)) {
        return res.status(400).json({ message: 'Item name and description must not contain emojis.' });
    }

    // Validate item dosage and quantity
    if(!isValidNumber(dosage) || !isValidNumber(quantity)) return res.status(400).json({ message: 'Item dosage and quantity must be valid numbers greater than 0' });

    // ✅ Convert to numbers after validation
    const numericDosage = Number(dosage);
    const numericQuantity = Number(quantity);

    const itemDetails = {itemName, dosage: numericDosage, quantity: numericQuantity, expiryDate, description, createdBy};
    
    // Check the messages inputs
    if (Object.values(itemDetails).some(details => details === undefined || details === null || details === '')) return res.status(400).json({ message: 'Kindly check your item details'});


    try {

        const newItem = new inventoryDB ({ ...itemDetails });

        await newItem.save();
        return res.status(201).json({
            message: "Item added successfully.",
            item: newItem
        });

    } catch (err) {
        console.error(`Error: ${err}`); 
        console.log(`Cause of error: ${err.message}`);

        return res.status(500).json({
            message: 'Something went wrong while inserting item.',
        });
    }
}

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

    if(!isValidNumber(dosage) || !isValidNumber(quantity)) return res.status(400).json({ message: 'Item dosage and quantity must be valid numbers greater than 0' });

    // ✅ Convert to numbers after validation
    const numericDosage = Number(dosage);
    const numericQuantity = Number(quantity);

    const itemDetails = {itemName, dosage: numericDosage, quantity: numericQuantity, expiryDate: new Date(expiryDate), description, createdBy};

    try {
        const updatedItem = await inventoryDB.findByIdAndUpdate(
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

// Remove Item
exports.removeItem = async (req, res) => {
    const {id} = req.params;

    // Validate object Id
    if (!checkItemId(id)){ 
        return res.status(400).json({ message: "Invalid Item ID." })
    };

    try {
        const removedItem = await inventoryDB.findByIdAndUpdate(
            id,
            { itemStatus: "removed" },
            { new: true }
        );

        if (!removedItem) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        return res.status(200).json({
            message: 'Item removed successfully.',
            item: removedItem
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({
            message: 'Something went wrong while removing item.'
        });
    }

}

// Restore Item
exports.restoreItem = async (req, res) => {
    const {id} = req.params;

    // Validate object Id
    if (!checkItemId(id)) return res.status(400).json({ message: "Invalid Item ID." });

    try {
        const restoreItem = await inventoryDB.findByIdAndUpdate(
            id,
            { itemStatus: "In Stock" },
            { new: true }
        );

        if (!restoreItem) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        return res.status(200).json({
            message: 'Item restored successfully.',
            item: restoreItem
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({
            message: 'Something went wrong while restoring item.'
        });
    }

}

// Delete Item
exports.deleteItem = async (req, res) => {

    const { id } = req.params;

    // Validate object Id
    if (!checkItemId(id)) return res.status(400).json({ message: "Invalid Item ID." });

    try {
        const deletedItem = await inventoryDB.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        res.status(200).json({ message: "Item deleted successfully.", item: deletedItem });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({
            message: 'Something went wrong while deleting item.'
        });
    }
}

// Get All Item
exports.getAllItem = async (req, res) => {
    try {
        const items = await inventoryDB.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Validate inputs letters and negative numbers are not allowed
function isValidNumber (value) {
    if (typeof value !== 'string') return false; // Only allow strings

    // Reject exponential, letters, negatives, etc.
    if (!/^\d+(\.\d+)?$/.test(value)) return false;

    const number = Number(value);
    return !isNaN(number) && isFinite(number) && number > 0;
};

// Check item Id
function checkItemId (id) {
    return mongoose.Types.ObjectId.isValid(id);
}