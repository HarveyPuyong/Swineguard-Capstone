const inventoryDB = require('../models/inventoryModel');
const mongoose = require('mongoose');
const {isValidNumber, isInvalidInput, checkExpiryDate} = require('./../utils/inventoryUtils');

//Add Item to the collections
exports.AddItem = async (req, res) => {
    const { itemName, dosage, quantity, expiryDate, description, createdBy } = req.body;

    // Check for emojis in itemName and description
    if (isInvalidInput(itemName, description))
        return res.status(400).json({ message: 'Item name and description must not be empty or contain emojis.' });

    // Validate item dosage and quantity
    if (!isValidNumber(dosage) || !isValidNumber(quantity))
        return res.status(400).json({ message: 'Item dosage and quantity must be valid numbers and greater than 0' });

    const numericDosage = Number(dosage);
    const numericQuantity = Number(quantity);

    const itemDetails = {
        itemName,
        dosage: numericDosage,
        quantity: numericQuantity,
        expiryDate,
        description,
        createdBy
    };

    // Check if any details are missing
    if (Object.values(itemDetails).some(details => details === undefined || details === null || details === ''))
        return res.status(400).json({ message: 'Kindly check your item details' });

    // Check Expiration Date
    if (checkExpiryDate(expiryDate))
        return res.status(400).json({ message: 'Past and current year are not allowed for expiration date.' });

    try {
        // Check if item with same name, dosage, and expiryDate already exists
        const existingItem = await inventoryDB.findOne({
            itemName,
            dosage: numericDosage,
            expiryDate
        });

        if (existingItem) {
            // Just update the quantity
            existingItem.quantity += numericQuantity;
            await existingItem.save();

            return res.status(201).json({
                message: `Item with ${expiryDate} expiry date is already exists. Quantity updated successfully.`,
                item: existingItem
            });
        } else {
            // Add new item
            const newItem = new inventoryDB({ ...itemDetails });
            await newItem.save();

            return res.status(201).json({
                message: "Item added successfully.",
                item: newItem
            });
        }

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
        const currentDate = new Date();

        const updatedItems = await Promise.all(
            items.map(async item => {
                let newStatus = 'in-stock';

                // 💡 If the item was marked as removed, don't change it
                if (item.itemStatus === 'removed') {
                    newStatus = 'removed';
                } else if (new Date(item.expiryDate) <= currentDate) {
                    newStatus = 'expired';
                } else if (item.quantity === 0) {
                    newStatus = 'out-of-stock';
                } else if (item.quantity <= 10) {
                    newStatus = 'less-stock';
                }

                if (item.itemStatus !== newStatus) {
                    item.itemStatus = newStatus;
                    await item.save();
                }

                return item;
            })
        );

        res.status(200).json(updatedItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get Item Id
exports.getItemId = async (req, res) => {
    const { id } = req.params;
    // if (checkItemId(id)) return res.status(400).json({ message: 'Invalid item Id' })
    try {
        const existingItem = await inventoryDB.findById(id);
        if (!existingItem) return res.status(404).json({ message: 'Item not found.' });
        res.status(200).json(existingItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Check item Id
function checkItemId (id) {
    return mongoose.Types.ObjectId.isValid(id);
}