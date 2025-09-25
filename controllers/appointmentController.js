const appointmentDB = require('./../models/appointmentModel');
const mongoose = require('mongoose');
const { checkSwineCountLimit, isValidAppointmentTime } = require('./../utils/appointmentUtils');
const {isValidNumber} = require('./../utils/inventoryUtils');

// Request Apointments
exports.addAppointment = async (req, res) => {
    const { 
        clientId, 
        swineIds, 

        clientFirstname, 
        clientLastname, 
        contactNum, 
        clientEmail,
        municipality, 
        barangay, 
        
        appointmentService, 
        swineType, 
        swineCount, 
        appointmentDate, 
        appointmentTime, 
        swineAge, 
        swineMale, 
        swineFemale, 
        appointmentType,
        clinicalSigns, 
    } = req.body;

    // Validate text only and not allow emojis
    const nameRegex = /^[A-Za-z\s\-'.]+$/;

    if (!nameRegex.test(clientFirstname) || !nameRegex.test(clientLastname) ) {
        return res.status(400).json({ message: 'Name fields must only contain letters, spaces, hyphens, apostrophes, or periods. Numbers and emojis are not allowed.' });
    }

    // Validate only the REQUIRED fields based on schema
    if (
        !clientFirstname ||
        !clientLastname ||
        !contactNum ||
        !barangay ||
        !municipality ||
        !appointmentService ||
        !appointmentDate ||
        !appointmentTime ||
        !swineType ||
        !clinicalSigns ||
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
        swineIds, 

        clientFirstname, clientLastname, 
        contactNum, 
        clientEmail,
        municipality, 
        barangay, 
        
        appointmentService, 
        appointmentDate, 
        appointmentTime, 
        appointmentType,
        swineType,       
        swineCount,    
        swineAge, 
        swineMale, 
        swineFemale,
        clinicalSigns
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

// Accept appointment
exports.acceptAppointment = async (req, res) => {
    const { appointmentDate, appointmentTime, vetPersonnel} = req.body;
    const appointmentId = req.params.id;

    // Check Object Id
    if (!isValidAppointmentId(appointmentId)) {
        return res.status(400).json({ message: 'Invalid Appointment Id.' });
    }

    // Get appointment first to access its type
    const existingAppointment = await appointmentDB.findById(appointmentId);
    if (!existingAppointment) {
        return res.status(400).json({ message: 'Appointment not found.' });
    }

    const appointmentType = existingAppointment.appointmentType?.toLowerCase();

    // Basic field validation
    if (!appointmentDate || !appointmentTime || !vetPersonnel) {
        return res.status(400).json({ message: 'Date, Time, and Personnel are required.' });
    }

    // Appointment date check
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const apptDate = new Date(appointmentDate);
    apptDate.setHours(0, 0, 0, 0);

    if (apptDate < today) {
        return res.status(400).json({ message: 'Past dates are not allowed for appointments.' });
    }

    // Check appointment time conflict
    const checkAppointmentTime = await isValidAppointmentTime(appointmentDate, appointmentTime, existingAppointment.municipality);
    if (!checkAppointmentTime.valid) {
        return res.status(400).json({ message: checkAppointmentTime.message });
    }

    // Check swine count limit
    const swineCheck = await checkSwineCountLimit(appointmentDate, existingAppointment.swineCount);
    if (!swineCheck.success) {
        return res.status(400).json({ message: swineCheck.message });
    }

    // Prepare update values
    const updateData = {
        appointmentDate,
        appointmentTime,
        appointmentStatus: 'accepted',
        vetPersonnel
    };

    // Perform update
    const updated = await appointmentDB.findByIdAndUpdate(
        appointmentId,
        updateData,
        { new: true }
    );

    return res.status(200).json({
        message: 'Appointment accepted successfully.',
        data: updated
    });
};


// Reschedule appointment
exports.rescheduleAppointment = async (req, res) => {
  const { appointmentDate, appointmentTime, vetPersonnel, vetMessage } = req.body;
  const appointmentId = req.params.id;

  // Validate ObjectId
  if (!isValidAppointmentId(appointmentId)) {
    return res.status(400).json({ message: 'Invalid Appointment Id.' });
  }

  // Find appointment
  const existingAppointment = await appointmentDB.findById(appointmentId);
  if (!existingAppointment) {
    return res.status(404).json({ message: 'Appointment not found.' });
  }

  // Validate fields
  if (!appointmentDate || !appointmentTime || !vetPersonnel) {
    return res.status(400).json({ message: 'Date, Time, and Personnel are required.' });
  }

  // Date validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const apptDate = new Date(appointmentDate);
  apptDate.setHours(0, 0, 0, 0);

  if (apptDate < today) {
    return res.status(400).json({ message: 'Past dates are not allowed for appointments.' });
  }

  // Check time conflict
  const checkAppointmentTime = await isValidAppointmentTime(
    appointmentDate,
    appointmentTime,
    existingAppointment.municipality
  );
  if (!checkAppointmentTime.valid) {
    return res.status(400).json({ message: checkAppointmentTime.message });
  }

  // Check swine count
  const swineCheck = await checkSwineCountLimit(appointmentDate, existingAppointment.swineCount);
  if (!swineCheck.success) {
    return res.status(400).json({ message: swineCheck.message });
  }

  // Prepare update
  const updateData = {
    appointmentDate,
    appointmentTime,
    appointmentStatus: 'reschedule'
  };

  // Update
  const updated = await appointmentDB.findByIdAndUpdate(
    appointmentId,
    updateData,
    { new: true }
  );

  return res.status(200).json({
    message: 'Appointment rescheduled successfully.',
    data: updated
  });
};



// Complete appointment
exports.completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { medicineAmount, medicine } = req.body;

        if (!medicineAmount || isNaN(medicineAmount)) {
            return res.status(400).json({ message: 'Medicine Amount is required and must be a number' });
        }

        if (!medicine || medicine.trim() === "") {
            return res.status(400).json({ message: 'Medicine is required' });
        }

        // Check Object Id if exist or valid
        if(!isValidAppointmentId(id)) return res.status(400).json({ message: 'Invalid Appointment Id.' });

        if (!isValidNumber(medicineAmount)) return res.status(400).json({ message: 'Medicine amount must be valid numbers and greater than 0' });

        const numericAmount = Number(medicineAmount);

        // Prepare update values
        const updateData = {
            medicine,
            medicineAmount: numericAmount,
            appointmentStatus: 'completed'
        };

        const update = await appointmentDB.findByIdAndUpdate(
            id,
            updateData,
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
exports.getAllAppointmentsWithFourDigitId = async (req, res) => {
    try {
        const appointments = await appointmentDB.find()
            .populate("swineIds", "swineFourDigitId type"); 
            // include type so we can prefix it

        const updatedAppointments = appointments.map(appointment => {
            const formattedSwines = appointment.swineIds.map(swine => {
                if (swine.type) {
                    const prefix = swine.type.charAt(0).toUpperCase(); // Get first letter of type
                    return `${prefix}${swine.swineFourDigitId}`;
                }
                return swine.swineFourDigitId; // fallback if type missing
            });

            return {
                ...appointment.toObject(),
                swineIds: formattedSwines
            };
        });

        res.status(200).json(updatedAppointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentDB.find();

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAppointmentById = async (req, res) => {
    const { id } = req.params;
    if (!isValidAppointmentId(id)) return res.status(400).json({ message: 'Invalid appointment Id.' });
    try {
        const existingAppointment = await appointmentDB.findById(id);
        if (!existingAppointment) return res.status(404).json({ message: 'Appointment not found.' });
        res.status(200).json(existingAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Verify Appointment Object Id
function isValidAppointmentId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
