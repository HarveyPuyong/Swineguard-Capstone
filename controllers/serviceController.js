const serviceDB = require('./../models/serviceModel');
//const { isValidInput } = require('./../utils/verifyInput');
const { isValidInput, containsEmoji, hasNumber, containsSpecialChar }= require('./../utils/inputChecker');

// Add Services
const addServices = async (req, res) => {
    const { serviceName, description } = req.body;

    // Check the length of inputs
    if (!isValidInput(serviceName) || !isValidInput(description)) return res.status(400).json({ message: 'Please provide valid and longer input.'});

    // Check for Emojis
    if (containsEmoji(serviceName) || containsEmoji(description)) return res.status(400).json({ message: 'Emoji are not allowed for service name.'});

    // Check for Numbers
    if (hasNumber(serviceName)) return res.status(400).json({ message: 'Numbers are not allowed.'});

    // Check for Special Chracters
    if (containsSpecialChar(serviceName)) return res.status(400).json({ message: 'Special characters are not allowed.'});
    

    try {
        //Check the Mongo DB if the services exist
        const existingServices = await serviceDB.findOne({ serviceName });

        // Check if the Services is already existed
        if(existingServices) return res.status(409).json({message: "Service already exists."});

        //Proceed to saving
        const newService = new serviceDB ({ serviceName, description });
        await newService.save();
        return res.status(201).json({ 
            service: newService, 
            message: 'Services added successfully.' 
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        console.log(`Cause of error: ${err.message}`);

        return res.status(500).json({ message: 'Something went wrong while adding services.' });
    }

}

// Edit Services
const editServices = async (req, res) => {
    const { id } = req.params;
    const { serviceName, description } = req.body;

    // Check the length of inputs
    if (!isValidInput(serviceName) || !isValidInput(description)) return res.status(400).json({ message: 'Please provide valid and longer input.'});

    // Check for Emojis
    if (containsEmoji(serviceName) || containsEmoji(description)) return res.status(400).json({ message: 'Emoji are not allowed for service name.'});

    // Check for Numbers
    if (hasNumber(serviceName)) return res.status(400).json({ message: 'Numbers are not allowed.'});

    // Check for Special Chracters
    if (containsSpecialChar(serviceName)) return res.status(400).json({ message: 'Special characters are not allowed.'});

    try {
        // Check services id if exist
        const updatedService = await serviceDB.findByIdAndUpdate( id, {
            serviceName, description 
        }, { new: true});

        if (!updatedService) return res.status(404).json({ message: 'Services not found.' });

        res.status(200).json({ 
            service: updatedService,
            message: `${serviceName} service updated successfully.`
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        console.log(`Cause of error: ${err.message}`);
        return res.status(500).json({ message: 'Something went wrong while adding services.' });
    }
}

// Get Services
const getAllServices = async (req, res) => {
    try {
        const services = await serviceDB.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { addServices, editServices, getAllServices }