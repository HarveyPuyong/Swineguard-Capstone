const swineDB = require('./../models/swineModel');

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

    const {type, weight, healthStatus, cause} = req.body;


    // Validate swine weight
    if(!isValidNumber(weight)) return res.status(400).json({ message: 'Swine weight must be valid numbers greater than 0' });

    // ✅ Convert to numbers after validation
    const numericWeight = Number(weight);

    const swineData = {type, weight: numericWeight, healthStatus, cause};

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

