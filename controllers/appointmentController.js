const appointmentDB = require('./../models/appointmentModel');
const mongoose = require('mongoose');
const { checkSwineCountLimit, isValidAppointmentTime } = require('./../utils/appointmentUtils');

// Request Apointments
exports.addAppointment = async (req, res) => {
    const { 
        clientId, 
        swineId, 

        clientFirstname, 
        clientLastname, 
        contactNum, 
        clientEmail,
        municipality, 
        barangay, 
        
        appointmentTitle, 
        swineType, 
        swineCount, 
        appointmentDate, 
        appointmentTime, 
        swineSymptoms, 
        swineAge, 
        swineMale, 
        swineFemale, 
        appointmentStatus
    } = req.body;

    // Validate text only and not allow emojis
    const nameRegex = /^[A-Za-z\s\-'.]+$/;

    if (!nameRegex.test(clientName) ) {
        return res.status(400).json({ message: 'Name fields must only contain letters, spaces, hyphens, apostrophes, or periods. Numbers and emojis are not allowed.' });
    }

    // Appointment type validation
    const validTypes = ["service", "visit"];

    // Validate only the REQUIRED fields based on schema
    if (
        !clientFirstname ||
        !clientLastname ||
        !contactNum ||
        !barangay ||
        !municipality ||
        !appointmentTitle ||
        !appointmentDate ||
        !appointmentTime ||
        !swineType ||
        !swineSymptoms ||
        swineCount == null ||
        swineAge == null ||
        swineMale == null ||
        swineFemale == null ||
        !appointmentDate ||
        !appointmentTime
    ) {
        return res.status(400).json({ message: 'Please fill out all required fields' });
    }

    // Validate swine count age and number of genders
    if (![swineCount, swineMale, swineFemale].every(val => typeof val === 'number' && Number.isInteger(val) && val >= 0)) {
        return res.status(400).json({ message: 'Swine values must be positive whole numbers.' });
    }

    if (swineAge < 0) return res.status(400).json({ message: 'Swine age should not be less than 0' });

    if (swineCount === 0) {
        return res.status(400).json({ message: 'Swine count should not be 0' });
    }

    // Check swine count and gender count
    if (swineCount !== (swineFemale + swineMale)){ return res.status(400).json({ message: 'Your swine count do not match with your male and female numbers' })};

    // Check Appointment Date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const appointment = new Date(appointmentDate);
    appointment.setHours(0, 0, 0, 0); // Normalize to compare only dates

    if (appointment < today) {
        return res.status(400).json({ message: 'Past dates are not allowed for appointments.' });
    } 
    
    // Check Appointment Time
    const checkAppointmentTime = await isValidAppointmentTime(appointmentDate, appointmentTime, municipality);
    if(!checkAppointmentTime.valid) return res.status(400).json({ message: checkAppointmentTime.message });

    const appointmentData = {
        clientId, 
        swineId, 

        clientFirstname, clientLastname, 
        contactNum, 
        clientEmail,
        municipality, 
        barangay, 
        
        appointmentTitle, 
        appointmentDate, 
        appointmentTime, 
        appointmentType,
        swineSymptoms, 
        swineAge, 
        swineMale, 
        swineFemale, 
        appointmentStatus
    };

    try {

        // Check total swine count for the day
        const swineCheck = await checkSwineCountLimit(appointmentDate, swineCount);
        if (!swineCheck.success) {
            return res.status(400).json({ message: swineCheck.message });
        }

        // Add appointment action
        const addAppointment = new appointmentDB({ ...appointmentData });

        await addAppointment.save();
        res.status(201).json({
            message: 'Appointment added successfully',
            data: addAppointment
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// Accept appointment by Id Mark as Ongoing
exports.acceptAppointment = async (req, res) => {
    
    const { appointmentDate, appointmentTime, appointmentType, vetPersonnel, medicine, dosage, vetMessage } = req.body;

    const appointmentId = req.params.id;

    // Check Object Id if exist or valid
    if (!isValidAppointmentId(appointmentId)) {
        return res.status(400).json({ message: 'Invalid Appointment Id.' });
    }

    // Check input Fields
    if ([appointmentDate, appointmentTime, appointmentType, medicine, dosage, vetPersonnel].some(field => !field || field === null)) return res.status(400).json({ message: 'Kindly check your Appointment details' })

    // Check Appointment Date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const apptDate = new Date(appointmentDate);
    apptDate.setHours(0, 0, 0, 0);

    if (apptDate < today) {
        return res.status(400).json({ message: 'Past dates are not allowed for appointments.' });
    } 

    // Validate input fields
    if ([appointmentDate, appointmentTime, vetPersonnel, medicine, dosage].some(field => field === undefined || field === null)) {
        return res.status(400).json({ message: 'Kindly check your appointment details' });
    }

    // Check Appointment Time
    const userMunicipality = await appointmentDB.findById(appointmentId);
    const checkAppointmentTime = await isValidAppointmentTime(appointmentDate, appointmentTime, userMunicipality.municipality);
    if(!checkAppointmentTime.valid) return res.status(400).json({ message: checkAppointmentTime.message });

    try {

        const existingAppointment = await appointmentDB.findById(appointmentId);
        if (!existingAppointment) return res.status(400).json({ message: 'Appointment not found.' })

        // Check Swine Count
        const swineCheck = await checkSwineCountLimit(appointmentDate, existingAppointment.swineCount);
        if (!swineCheck.success) {
            return res.status(400).json({ message: swineCheck.message });
        }
        
        // Proceed to updating to accept appointment
        const update = await appointmentDB.findByIdAndUpdate(
            appointmentId,
            { appointmentDate, appointmentTime, appointmentStatus: "ongoing", vetPersonnel, medicine, dosage, vetMessage },
            { new : true } 
        );

        // Success yung pag update ng appointments
        res.status(200).json({
            message: 'Appointment accepted successfully.',
            data: update
        });

    } catch (err) {
        console.error("Error updating appointment", err);
        res.status(500).json({error: "Failed to update appointment"});
    }
}


// Reschedule appointment
exports.rescheduleAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const update = await appointmentDB.findByIdAndUpdate(
            appointmentId,
            { appointmentStatus: "reschedule" },
            { new: true }
        );

        if (!update) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment rescheduled successfully.",
            data: update
        });

    } catch (err) {
        console.error("❌ Error rescheduling appointment:", err.message);
        res.status(500).json({ error: "Failed to reschedule appointment" });
    }
}


// Complete appointment
exports.completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // Check Object Id if exist or valid
        if(!isValidAppointmentId(id)) return res.status(400).json({ message: 'Invalid Appointment Id.' });

        const update = await appointmentDB.findByIdAndUpdate(
            id,
            { appointmentStatus: "completed" },
            { new: true }
        );

        if (!update) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment completed successfully.",
            data: update
        });

    } catch (err) {
        console.error("❌ Error completing appointment:", err.message);
        res.status(500).json({ error: "Failed to complete appointment" });
    }
}


// Remove appointment
exports.removeAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // Check Object Id if exist or valid
        if(!isValidAppointmentId(id)) return res.status(400).json({ message: 'Invalid Appointment Id.' });

        const update = await appointmentDB.findByIdAndUpdate(
            id,
            { appointmentStatus: "removed" },
            { new: true }
        );

        if (!update) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment removed successfully.",
            data: update
        });

    } catch (err) {
        console.error("❌ Error removing appointment:", err.message);
        res.status(500).json({ error: "Failed to remove appointment" });
    }
}

// Restore appointments
exports.restoreAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // Check Object Id if exist or valid
        if(!isValidAppointmentId(id)) return res.status(400).json({ message: 'Invalid Appointment Id.' });

        const update = await appointmentDB.findByIdAndUpdate(
            id,
            { appointmentStatus: "pending" },
            { new: true }
        );

        if (!update) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment restored successfully.",
            data: update
        });

    } catch (err) {
        console.error("❌ Error restoring appointment:", err.message);
        res.status(500).json({ error: "Failed to restore appointment" });
    }
}

// Delete appointments
exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // Check Object Id if exist or valid
        if(!isValidAppointmentId(id)) return res.status(400).json({ message: 'Invalid Appointment Id.' });

        const deletedAppointment = await appointmentDB.findByIdAndDelete(id);

        if (!deletedAppointment) return res.status(404).json({ error: "Appointment not found" });

        res.status(200).json({ message: "Appointment deleted successfully", deletedAppointment });

    } catch (err) {
        console.error("Error deleting appointment", err);
        res.status(500).json({error: "Failed to delte appointment"});
    }
}

//GET ALL APPOINTMENTS
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentDB.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Verify Appointment Object Id
function isValidAppointmentId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
