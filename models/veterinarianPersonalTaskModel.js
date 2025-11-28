const mongoose = require('mongoose');

const VeterinarianScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
}, { collection: 'vetPersonalSchedule', timestamps: true });

const numberOfAppointmentsPerDay_Schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  totalAppointment: { type: Number, default: 5 }
}, { collection: 'numberOfAppointmentPerDay', timestamps: true });


// ✅ Create models
const VeterinarianSchedule = mongoose.model(
  "VeterinarianSchedule",
  VeterinarianScheduleSchema
);

const NumberOfAppointmentsPerDay = mongoose.model(
  "NumberOfAppointmentsPerDay",
  numberOfAppointmentsPerDay_Schema
);


// ✅ Export the models
module.exports = {
  VeterinarianSchedule,
  NumberOfAppointmentsPerDay
};
