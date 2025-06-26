const appointmentDB = require('./../models/appointmentModel');
const MAX_SWINE_PER_DAY = 30;

// Check Date and Swine Limit for Day
async function checkSwineCountLimit(appointmentDate, swineCount) {
    const dateStart = new Date(appointmentDate);
    dateStart.setHours(0, 0, 0, 0);

    const dateEnd = new Date(appointmentDate);
    dateEnd.setHours(23, 59, 59, 999);

    const totalSwineForTheDay = await appointmentDB.aggregate([
        {
            $match: {
                appointmentDate: { $gte: dateStart, $lte: dateEnd },
                appointmentStatus: { $eq: "ongoing" }
            }
        },
        {
            $group: {
                _id: null,
                totalSwine: { $sum: "$swineCount" }
            }
        }
    ]);


    const currentTotal = totalSwineForTheDay[0]?.totalSwine || 0;
    const newTotal = currentTotal + swineCount;

    if (newTotal > MAX_SWINE_PER_DAY) {
        return {
            success: false,
            message: `Appointment rejected. Only ${MAX_SWINE_PER_DAY - currentTotal} swine(s) can be scheduled for ${appointmentDate}.`
        };
    }

    return { success: true };
}

// Check the Time
async function isValidAppointmentTime(appointmentDate, appointmentTime, municipality) {
    // Basic time format validation
    const [hour, minute] = appointmentTime.split(':').map(Number);
    if (isNaN(hour) || isNaN(minute)) return { valid: false, message: 'Invalid time format' };

    const timeInMinutes = hour * 60 + minute;
    const startTime = 7 * 60 + 30;  // 7:30 AM
    const endTime = 16 * 60 + 30;  // 4:30 PM

    if (timeInMinutes < startTime || timeInMinutes > endTime) {
        return { valid: false, message: 'Appointment time must be between 7:30 AM and 4:30 PM.' };
    }

    // Normalize the date to avoid time differences
    const dateStart = new Date(appointmentDate);
    dateStart.setHours(0, 0, 0, 0);

    const dateEnd = new Date(appointmentDate);
    dateEnd.setHours(23, 59, 59, 999);

    // Check for existing accepted appointment with same time in the same municipality
    const isTaken = await appointmentDB.findOne({
        appointmentDate: { $gte: dateStart, $lte: dateEnd },
        appointmentTime: appointmentTime,
        municipality: municipality,
        appointmentStatus: 'ongoing'
    });

    if (isTaken) {
        return {
            valid: false,
            message: `The appointment time ${appointmentTime} in ${municipality} is already occupied.`
        };
    }

    return { valid: true };
}

// ✅ Export both in one object
module.exports = {
    checkSwineCountLimit,
    isValidAppointmentTime
};