const inventoryDB = require('../models/inventoryModel');

//Add Item to the collections
exports.AddItem = async (req, res) => {

    const {itemName, amount, quantity, expiryDate, description, createdBy} = req.body;
    const itemDetails = [itemName, amount, quantity, expiryDate, description, createdBy];

    // Check the messages inputs
    if (itemDetails.some(details => !details)) return res.status(400).json({ message: 'Kidly check your item details'});

    try {
        // Get sender from the authenticated user (decoded token) yung nasa verifyJWT.js
        const newItem = await inventoryDB.create (
            {
                itemName, 
                amount, 
                quantity, 
                expiryDate, 
                description,
                createdBy
            }
        );

        return res.status(201).json({message: "Item added successfully."});

    } catch (err) {
        console.error(`Error: ${err}`); 
        console.log(`Cause of error: ${err.message}`);

        return res.status(500).json({
            message: 'Something went wrong while inserting item.',
        });
    }
}

// Update the Item details

// Remove Item to the DB
