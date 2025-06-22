const swineDB = require('./../models/swineModel');

// Add Swine
exports.addSwine = async (req, res) => {

    const {breed, type, birthdate, sex, weight, clientId} = req.body;
    const swineData = {breed, type, birthdate, sex, weight, clientId};

    // Check the messages inputs
    if (Object.values(swineData).some(data => !data)) return res.status(400).json({ message: 'Kindly check your swine data'});

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

    const {breed, type, birthdate, sex, weight} = req.body;
    const swineData = {breed, type, birthdate, sex, weight};
    
    // Validate input fields
    if (Object.values(swineData).some(field => field === undefined || field === null)) {
        return res.status(400).json({ message: 'Kindly check your swine details' });
    }
    if(!id) return res.status(400).json({message: "Swine id not found."});

    try {
        const updatedSwineData = await swineDB.findByIdAndUpdate(
            id,
            { breed, type, birthdate, sex, weight },
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