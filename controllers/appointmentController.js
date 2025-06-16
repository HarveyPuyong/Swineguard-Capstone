const appointmentDB = require('./../models/appointmentModel');

// Add Apointments
exports.addAppointment = async (req, res) => {
    const {clientId, swineId, 
           appointmentTitle, appointmentDate,appointmentTime,
           symptoms
    } = req.body;
            
    const appointmentData = {clientId, swineId, 
                             appointmentTitle, appointmentDate, appointmentTime,
                             symptoms
    };

     // Check the Appointment data
    if (Object.values(appointmentData).some(data => !data)) return res.status(400).json({ message: 'Please fill out all required fields'});

    try {
        const addAppointment = new appointmentDB({ ...appointmentData });

        await addAppointment.save();
        res.status(201).json({message: 'Appointment added successfully'});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// Accept appointment by Id Mark as Ongoing
exports.acceptAppointment = async (req, res) => {
    
    const { appointmentDate, appointmentTime, appointmentStatus, vetPersonnel, medicine, dosage, vetMessage } = req.body;

    const appointmentId = req.params.id;

    // Check if ID is provided
    if (!appointmentId) return res.status(400).json({ message: 'Appointment ID is required in the URL.' });


    try {
        const update = await appointmentDB.findByIdAndUpdate(
            appointmentId,
            { appointmentDate, appointmentTime, appointmentStatus, vetPersonnel, medicine, dosage, vetMessage },
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