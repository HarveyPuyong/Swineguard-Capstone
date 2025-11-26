const mongoose = require('mongoose');

const VeterinarianScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {             // Name of the personal task
    type: String,
    required: true
  },

  description: {       // Optional notes
    type: String
  },

  date: {              // The date of the task
    type: Date,      // Store as 'YYYY-MM-DD' to simplify matching
    required: true
  },


  availability: {     // Marks the veterinarian unavailable for appointments
    type: Boolean,
    default: false
  },


}, { collection: 'vetPersonalSchedule', timestamps: true });

module.exports = { VeterinarianScheduleSchema};