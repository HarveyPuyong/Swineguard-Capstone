const inventoryDB = require('../models/inventoryModel');
const mongoose = require('mongoose');

//Add Item to the collections
exports.AddItem = async (req, res) => {

    const {itemName, amount, quantity, expiryDate, description, createdBy} = req.body;
    const itemDetails = {itemName, amount, quantity, expiryDate, description, createdBy};

    // Check the messages inputs
    if (Object.values(itemDetails).some(details => !details)) return res.status(400).json({ message: 'Kindly check your item details'});

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
    const { itemName, amount, quantity, expiryDate, description, createdBy } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid item ID.' });
    }

    // Validate input fields
    if ([itemName, amount, quantity, expiryDate, description, createdBy].some(field => field === undefined || field === null)) {
        return res.status(400).json({ message: 'Kindly check your item details' });
    }

    try {
        const updatedItem = await inventoryDB.findByIdAndUpdate(
            id,
            { itemName, amount, quantity, expiryDate: new Date(expiryDate), description, createdBy },
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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid item ID.' });
    }

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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid item ID.' });
    }

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

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid item ID.' });
    }

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
