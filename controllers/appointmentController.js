const appointmentDB = require('./../models/appointmentModel');
const mongoose = require('mongoose');
const { checkSwineCountLimit, isValidAppointmentTime, isVetScheduledOnDate } = require('./../utils/appointmentUtils');
const {isValidNumber} = require('./../utils/inventoryUtils');
const { NumberOfAppointmentsPerDay } = require('./../models/veterinarianPersonalTaskModel');

// Request Apointments
exports.addAppointment = async (req, res) => {
  try {
    // 1️⃣ Parse JSON data from FormData
    const parsedData = JSON.parse(req.body.data);

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
      clinicalSigns
    } = parsedData;

    // 2️⃣ Handle single uploaded file
    const swineImage = req.file ? req.file.filename : null;
    
    // 1️⃣ Get total allowed appointments (sum of all users)
    const totalAppointmentsLimitAgg = await NumberOfAppointmentsPerDay.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAppointment" } } }
    ]);

    const totalAppointmentsLimit = totalAppointmentsLimitAgg[0]?.total || 0;

    // 2️⃣ Count existing appointments for the same date
    const existingAppointmentsCount = await appointmentDB.countDocuments({
      appointmentDate: new Date(appointmentDate)
    });

    // 3️⃣ Check if the date is full
    if (existingAppointmentsCount >= totalAppointmentsLimit) {
      return res.status(400).json({
        message: `All appointments on ${appointmentDate} are full.`
      });
    }

    // 3️⃣ Validation - Names
    const nameRegex = /^[A-Za-z\s\-'.]+$/;
    if (!nameRegex.test(clientFirstname) || !nameRegex.test(clientLastname)) {
      return res.status(400).json({
        message: 'Name fields must only contain letters, spaces, hyphens, apostrophes, or periods. Numbers and emojis are not allowed.'
      });
    }

    // 4️⃣ Validation - Required fields
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
      swineFemale == null
    ) {
      return res.status(400).json({ message: 'Please fill out all required fields' });
    }

    // 5️⃣ Convert numeric fields (since FormData sends them as strings)
    const swineCountNum = Number(swineCount);
    const swineMaleNum = Number(swineMale);
    const swineFemaleNum = Number(swineFemale);
    const swineAgeNum = Number(swineAge);

    // 6️⃣ Validate numeric values
    if (![swineCountNum, swineMaleNum, swineFemaleNum].every(val => Number.isInteger(val) && val >= 0)) {
      return res.status(400).json({ message: 'Swine values must be positive whole numbers.' });
    }

    if (swineAgeNum < 0) return res.status(400).json({ message: 'Swine age should not be less than 0' });
    if (swineCountNum === 0) return res.status(400).json({ message: 'Swine count should not be 0' });
    if (swineCountNum !== (swineFemaleNum + swineMaleNum)) {
      return res.status(400).json({ message: 'Your swine count does not match with your male and female numbers' });
    }

    // 7️⃣ Check appointment date (no past dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointment = new Date(appointmentDate);
    appointment.setHours(0, 0, 0, 0);
    if (appointment < today) {
      return res.status(400).json({ message: 'Past dates are not allowed for appointments.' });
    }

    // 8️⃣ Check appointment time availability
    const checkAppointmentTime = await isValidAppointmentTime(appointmentDate, appointmentTime, municipality);
    if (!checkAppointmentTime.valid) {
      return res.status(400).json({ message: checkAppointmentTime.message });
    }

    // 9️⃣ Check swine limit
    const swineCheck = await checkSwineCountLimit(appointmentDate, swineCountNum);
    if (!swineCheck.success) {
      return res.status(400).json({ message: swineCheck.message });
    }

    // 🔟 Construct appointment object
    const appointmentData = {
      clientId,
      swineIds,
      clientFirstname,
      clientLastname,
      contactNum,
      clientEmail,
      municipality,
      barangay,
      appointmentService,
      appointmentDate,
      appointmentTime,
      appointmentType,
      swineType,
      swineCount: swineCountNum,
      swineAge: swineAgeNum,
      swineMale: swineMaleNum,
      swineFemale: swineFemaleNum,
      clinicalSigns,
      swineImage // ✅ single image
    };

    // 1️⃣1️⃣ Save to database
    const newAppointment = new appointmentDB(appointmentData);
    await newAppointment.save();

    res.status(201).json({
      message: 'Appointment added successfully',
      data: newAppointment
    });

  } catch (err) {
    console.error('Add appointment error:', err);
    res.status(500).json({ error: err.message });
  }
};



// Accept appointment
exports.acceptAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, appointmentType, vetPersonnel } = req.body;
    const appointmentId = req.params.id;

    // Validate Object Id
    if (!isValidAppointmentId(appointmentId)) {
      return res.status(400).json({ message: 'Invalid Appointment Id.' });
    }

    const existingAppointment = await appointmentDB.findById(appointmentId);
    if (!existingAppointment) {
      return res.status(400).json({ message: 'Appointment not found.' });
    }

    // Validate required fields
    if (!appointmentDate || !appointmentTime || !vetPersonnel) {
      return res.status(400).json({ message: 'Date, Time, and Personnel are required.' });
    }

    // Date validation
    const today = new Date();
    today.setHours(0,0,0,0);
    const apptDate = new Date(appointmentDate);
    apptDate.setHours(0,0,0,0);

    if (apptDate < today) {
      return res.status(400).json({ message: 'Past dates are not allowed for appointments.' });
    }

    // Appointment time validation
    const checkAppointmentTime = await isValidAppointmentTime(appointmentDate, appointmentTime, existingAppointment.municipality);
    if (!checkAppointmentTime.valid) {
      return res.status(400).json({ message: checkAppointmentTime.message });
    }

    // Swine limit validation
    const swineCheck = await checkSwineCountLimit(appointmentDate, existingAppointment.swineCount);
    if (!swineCheck.success) {
      return res.status(400).json({ message: swineCheck.message });
    }

    // Vet schedule conflict check
    if (await isVetScheduledOnDate(vetPersonnel, appointmentDate)) {
      return res.status(400).json({ message: `Vetrinarian is not available on this date.` });
    }

    // ✅ Fully booked vet check
    const vetMax = await NumberOfAppointmentsPerDay.findOne({ userId: vetPersonnel });
    const maxAppointments = vetMax ? vetMax.totalAppointment : 0;

    const vetAppointmentsCount = await appointmentDB.countDocuments({
      vetPersonnel,
      appointmentDate: new Date(appointmentDate),
      appointmentStatus: { $in: ['accepted', 'reschedule'] }
    });

    if (vetAppointmentsCount >= maxAppointments) {
      return res.status(400).json({ 
        message: `Vetrinarian is fully booked on ${appointmentDate}. Please select another date or personnel.` 
      });
    }

    // ✅ Update appointment
    const updated = await appointmentDB.findByIdAndUpdate(
      appointmentId,
      {
        appointmentDate,
        appointmentTime,
        appointmentType,
        appointmentStatus: 'accepted',
        vetPersonnel
      },
      { new: true }
    );

    return res.status(200).json({
      message: 'Appointment accepted successfully.',
      data: updated
    });

  } catch (err) {
    console.error('Error accepting appointment:', err);
    return res.status(500).json({
      message: 'Something went wrong while accepting the appointment.',
      error: err.message
    });
  }
};




// Reschedule appointment
exports.rescheduleAppointment = async (req, res) => {
  const { appointmentDate, appointmentTime, vetPersonnel } = req.body;
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
    appointmentStatus: 'reschedule',
    vetPersonnel
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
// Complete appointment
exports.completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { medications, healthStatus, causeOfDeath } = req.body;

        // VALIDATION
        if (!Array.isArray(medications) || medications.length === 0) {
            return res.status(400).json({ message: "Medications list is required" });
        }

        // Check each medication entry
        for (const med of medications) {
            if (!med.medicine || med.medicine.trim() === "") {
                return res.status(400).json({ message: "Medicine field is required." });
            }
            if (!med.amount || isNaN(med.amount) || med.amount <= 0) {
                return res.status(400).json({ message: "Amount must be a valid number greater than 0." });
            }
        }

        // Check Object Id validity
        if (!isValidAppointmentId(id)) {
            return res.status(400).json({ message: 'Invalid Appointment Id.' });
        }

        // Update appointment
        const update = await appointmentDB.findByIdAndUpdate(
            id,
            {
                $push: { medications: { $each: medications } },
                $set: {
                    appointmentStatus: "completed",
                    underMonitoring: false,
                    healthStatus: healthStatus || "none",
                    causeOfDeath: causeOfDeath || "none"
                }
            },
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
};



// Mark appointment as under monitoring
exports.underMonitoringAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        // Check Object Id if exist or valid
        if(!isValidAppointmentId(id)) return res.status(400).json({ message: 'Invalid Appointment Id.' });

        const update = await appointmentDB.findByIdAndUpdate(
            id,
            { underMonitoring: true },
            { new: true }
        );

        if (!update) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment is under monitoring.",
            data: update
        });

    } catch (err) {
        console.error("❌ Error removing appointment:", err.message);
        res.status(500).json({ error: "Failed to monitor appointment" });
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


// Adjust Appointment date and give some medicines:
exports.updateAppointments = async (req, res) => {
    try {
        const { id } = req.params;
        const { medications, healthStatus, causeOfDeath, appointmentDate } = req.body;

        // Validate ID
        if (!isValidAppointmentId(id)) {
            return res.status(400).json({ message: 'Invalid Appointment Id.' });
        }

        // Validate medications
        if (!Array.isArray(medications) || medications.length === 0) {
            return res.status(400).json({ message: "At least one medicine is required" });
        }

        for (const med of medications) {
            if (!med.medicine || !med.amount || isNaN(med.amount)) {
                return res.status(400).json({ message: "Invalid medicine entry" });
            }
        }

        // Validate date
        if (appointmentDate && isNaN(new Date(appointmentDate).getTime())) {
            return res.status(400).json({ message: "Invalid appointment date" });
        }

        const updated = await appointmentDB.findByIdAndUpdate(
            id,
            {
                $push: { medications: { $each: medications } },   // ⬅ APPEND INSTEAD OF OVERWRITE
                $set: {
                    appointmentStatus: "accepted",
                    underMonitoring: false,
                    healthStatus,
                    appointmentDate,
                    causeOfDeath
                }
            },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        return res.status(200).json({
            message: "Appointment updated successfully",
            data: updated
        });

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Failed to update appointment" });
    }
};



// Verify Appointment Object Id
function isValidAppointmentId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
