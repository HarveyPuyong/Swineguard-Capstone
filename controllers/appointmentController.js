const appointmentDB = require('./../models/appointmentModel');

// Request Apointments
exports.addAppointment = async (req, res) => {
    const { 
        clientId, 
        swineId, 

        clientName, 
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

    if (!nameRegex.test(firstName) || !nameRegex.test(lastName) || 
        (middleName && !nameRegex.test(middleName)) || 
        (suffix && !nameRegex.test(suffix))) {
        return res.status(400).json({ message: 'Name fields must only contain letters, spaces, hyphens, apostrophes, or periods. Numbers and emojis are not allowed.' });
    }

    // Validate only the REQUIRED fields based on schema
    if (
        !clientName ||
        !contactNum ||
        !appointmentTitle ||
        !swineType ||
        swineCount == null ||
        swineSymptoms == null ||
        swineAge == null ||
        swineMale == null ||
        swineFemale == null ||
        !appointmentDate ||
        !appointmentTime
    ) {
        return res.status(400).json({ message: 'Please fill out all required fields' });
    }
    if (swineCount !== (swineFemale + swineMale)){ return res.status(400).json({ message: 'Your swine count do not match with your male and female numbers' })};
            

    const appointmentData = {
        clientId, 
        swineId, 

        clientName, 
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
    };

    try {
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
    
    const { appointmentDate, appointmentTime, vetPersonnel, medicine, dosage, vetMessage } = req.body;

    const appointmentId = req.params.id;

    // Check if ID is provided
    if (!appointmentId) return res.status(400).json({ message: 'Appointment ID is required in the URL.' });


    try {
        const update = await appointmentDB.findByIdAndUpdate(
            appointmentId,
            { appointmentDate, appointmentTime, appointmentStatus: "ongoing", vetPersonnel, medicine, dosage, vetMessage },
            { new : true } 
        );

        // If appointment not found
        if (!update) return res.status(404).json({ message: 'Appointment not found.' });

        // Success yung pag update ng appointments
        res.status(200).json({
            message: 'Appointment updated successfully.',
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
            id,
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