const swineDB = require('./../models/swineModel');
const mongoose = require('mongoose');

// Add Swine
exports.addSwine = async (req, res) => {

    const {breed, type, birthdate, sex, weight, clientId} = req.body;

    // Validate birthdate of swine
    if (new Date(birthdate) > new Date()) {
        return res.status(400).json({ message: 'Birthdate cannot be in the future.' });
    }

    // Validate swine weight
    if(!isValidNumber(weight)) return res.status(400).json({ message: 'Swine weight must be valid numbers greater than 0' });

    // ✅ Convert to numbers after validation
    const numericWeight = Number(weight);

    const swineData = {breed, type, birthdate, sex, weight: numericWeight, clientId};

    // Validate input fields
    if (Object.values(swineData).some(field => field === undefined || field === null)) {
        return res.status(400).json({ message: 'Kindly check your swine details' });
    }


    try {

        const newSwine = new swineDB ({ ...swineData });

        await newSwine.save();
        return res.status(201).json({
            message: "Swine added successfully.",
            item: newSwine
        });

    } catch (err) {
        console.error(`Error: ${err}`); 
        console.log(`Cause of error: ${err.message}`);

        return res.status(500).json({
            message: 'Something went wrong while adding swine.',
        });
    }
}

// Update Swine
exports.editSwine = async (req, res) => {
    const { id } = req.params;

    const {breed, type, birthdate, sex, weight, status, cause} = req.body;

    // Validate object Id
    if (!isValidSwineId(id)) return res.status(400).json({ message: "Invalid Swine ID." });

    // Validate birthdate of swine
    if (new Date(birthdate) > new Date()) {
        return res.status(400).json({ message: 'Birthdate cannot be in the future.' });
    }

    // Validate swine weight
    if(!isValidNumber(weight)) return res.status(400).json({ message: 'Swine weight must be valid numbers greater than 0' });

    // ✅ Convert to numbers after validation
    const numericWeight = Number(weight);

    const swineData = {breed, type, birthdate, sex, weight: numericWeight, status, cause};

    // Validate input fields
    if (Object.values(swineData).some(field => field === undefined || field === null)) {
        return res.status(400).json({ message: 'Kindly check your swine details' });
    }

    if(!id) return res.status(400).json({message: "Swine id not found."});

    try {
        const updatedSwineData = await swineDB.findByIdAndUpdate(
            id,
            { ...swineData },
            { new: true }
        );

        if (!updatedSwineData) {
            return res.status(404).json({ message: 'Swine not found.' });
        }

        return res.status(200).json({
            message: 'Swine updated successfully.',
            item: updatedSwineData
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({
            message: 'Something went wrong while updating swine data.'
        });
    }
}

// Remove Swine 
exports.removeSwine = async (req, res) => {
    const {id} = req.params;

    // Validate Object Id
    if(!isValidSwineId(id)) return res.status(400).json({ message: "Invalid Swine Id." });
    try {
        const removedSwine = await swineDB.findByIdAndUpdate(
            id,
            { status: "removed" },
            { new: true }
        );

        if (!removedSwine) { return res.status(404).json({ message: 'Swine not found.' }); }

        res.status(200).json({
            message: " Swine removed successfully.",
            swine: removedSwine
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({ message: "Something went wrong when removing swine." });
    }

}

// Restore Swine
exports.restoreSwine = async (req, res) => {
    const { id } = req.params;
    
    // Validate Object Id / Swine Id
    if (!isValidSwineId(id)) return res.status(400).json({ message: 'Invalid Swine Id.' });

    try {
        const restoredSwine = await swineDB.findByIdAndUpdate (
            id,
            { status: 'active' },
            {new: true}
        );

        if (!restoredSwine) return res.status(404).json({ message: "Swine not found." });

        res.status(200).json({
            message: 'Swine restored successfully.',
            swine: restoredSwine
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({ message: 'Something went wrong while restoring swine.'});
    }

}

// Delete Swine
exports.deleteSwine = async (req, res) => {

    const {id} = req.params;

    //Validate Object Id
    if(!isValidSwineId(id)) return res.status(400).json({ message: "Invalid Swine Id." });

    try {
        const deletedSwine = await swineDB.findByIdAndDelete(id);

        if(!deletedSwine) return res.status(404).json({ message: "Swine not found." });

        res.status(200).json({ message: "Swine deleted successfully", swine: deletedSwine });

    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(500).json({ message: "Something went wrong while deleting Swine." });
    }
}

// Get all Swine
exports.getSwine = async (req, res) => {
    try {
        const swines = await swineDB.find();
        res.status(200).json(swines);
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
function isValidSwineId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}