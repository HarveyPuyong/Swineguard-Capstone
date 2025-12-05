const {
  VeterinarianSchedule,
  NumberOfAppointmentsPerDay
} = require('./../models/veterinarianPersonalTaskModel');

const today = new Date().setHours(0, 0, 0, 0);

const mongoose = require('mongoose');
//const { isValidInput } = require('./../utils/verifyInput');
const { isValidInput, containsEmoji, hasNumber, containsSpecialChar }= require('./../utils/inputChecker');

exports.addNewVetSchedule = async (req, res) => {
    const { title, description, date, userId } = req.body;

    // Check the length of inputs
    if (!isValidInput(title) || !isValidInput(description)) return res.status(400).json({ message: 'Please provide valid and longer input.'});

    // Check for Emojis
    if (containsEmoji(title) || containsEmoji(description)) return res.status(400).json({ message: 'Emoji are not allowed for title and in description.'});

    // Check for Numbers
    if (hasNumber(title)) return res.status(400).json({ message: 'Numbers are not allowed.'});

    // Check for Special Chracters
    if (containsSpecialChar(title)) return res.status(400).json({ message: 'Special characters are not allowed.'});

    const schedDate = new Date(date).setHours(0, 0, 0, 0);
    if (schedDate < today) return res.status(400).json({ message: 'Past dates are not allowed.'});

    try {
        const newVetSchedule = new VeterinarianSchedule ({ title, description, date: schedDate, availability: "false", userId });
        await newVetSchedule.save();
        return res.status(201).json({ 
            newSchedule: newVetSchedule, 
            message: 'New schedule added successfully.' 
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        console.log(`Cause of error: ${err.message}`);

        return res.status(500).json({ message: 'Something went wrong while adding new schedule.' });
    }
}

exports.getVetSchedule = async (req, res) => {
    try {
        const vetSchedules = await VeterinarianSchedule.find();
        res.status(200).json(vetSchedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.editVetSchedule = async (req, res) => {
    const { id } = req.params;
    const { title, description, date } = req.body;

    // Check the length of inputs
    if (!isValidInput(title) || !isValidInput(description)) return res.status(400).json({ message: 'Please provide valid and longer input.'});

    // Check for Emojis
    if (containsEmoji(title) || containsEmoji(description)) return res.status(400).json({ message: 'Emoji are not allowed for title and in description.'});

    // Check for Numbers
    if (hasNumber(title)) return res.status(400).json({ message: 'Numbers are not allowed.'});

    // Check for Special Chracters
    if (containsSpecialChar(title)) return res.status(400).json({ message: 'Special characters are not allowed.'});

    const schedDate = new Date(date).setHours(0, 0, 0, 0);
    if (schedDate < today) return res.status(400).json({ message: 'Past dates are not allowed.'});

    try {

        const scheduleData = { title, description, date: schedDate };

        const editedVetSchedule = await VeterinarianSchedule.findByIdAndUpdate(
            id,
            scheduleData,
            { new: true }
        );
        
        if (!editedVetSchedule) {
            return res.status(404).json({ message: 'Schedule not found.' });
        }
        
        return res.status(201).json({ 
            newSchedule: editedVetSchedule, 
            message: 'Schedule edited successfully.' 
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        console.log(`Cause of error: ${err.message}`);

        return res.status(500).json({ message: 'Something went wrong while editing new schedule.' });
    }
}


exports.setNUmberOfAppointmentsPerDay = async (req, res) => {
    const { userId, totalAppointment } = req.body;

    // Check the length of inputs
    if ( totalAppointment < 0 ) return res.status(400).json({ message: 'The Number of appointments per day should not be negative.'});


    try {
        const numberOfAppointments = new NumberOfAppointmentsPerDay ({ userId, totalAppointment });
        await numberOfAppointments.save();
        return res.status(201).json({ 
            numberOfAppointments: numberOfAppointments, 
            message: 'Number of appointment per day updated successfully.' 
        });

    } catch (err) {
        console.error(`Error: ${err}`);
        console.log(`Cause of error: ${err.message}`);

        return res.status(500).json({ message: 'Something went wrong while updating max appointment.' });
    }
}

// Edit Services
exports.editNUmberOfAppointmentsPerDay = async (req, res) => {
    const { id } = req.params;
    const { totalAppointment } = req.body; // <-- match schema

    if (totalAppointment < 0) 
        return res.status(400).json({ message: 'Negative numbers are not allowed.' });

    try {
        const updatedMaxAppointment = await NumberOfAppointmentsPerDay.findByIdAndUpdate(
            id,
            { totalAppointment }, // <-- match schema
            { new: true }
        );

        if (!updatedMaxAppointment)
            return res.status(404).json({ message: 'User Max Appointment not found.' });

        res.status(200).json({ 
            totalMaxAppointment: updatedMaxAppointment,
            message: 'Max appointment updated successfully.'
        });

    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: 'Something went wrong while updating max appointment.' });
    }
};


exports.getNUmberOfAppointmentsPerDay = async (req, res) => {
    try {
        const totalNumOfAppointments = await NumberOfAppointmentsPerDay.find();
        res.status(200).json(totalNumOfAppointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
