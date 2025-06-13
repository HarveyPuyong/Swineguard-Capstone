const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentTitle: { type: String, required: true },
    appointmentType: {type: String, required: true },
    swineType: { type: String, required: true },
    swineCount: { type: String, required: true },
    
    dateSent: {type: String, required: true},
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    swineSymptoms: { type: String, required: true },
    swineAge: { type: String, required: true },
    swineMale: { type: String, required: true },
    swineFemale: { type: String, required: true },

    clientFirstname: { type: String, required: true },
    clientLastname: { type: String, required: true },
    clientContact: { type: String, required: true },
    clientEmail: { type: String, required: true },
     
    municipality: { type: String,},
    barangay: { type: String,},

    appointmentStatus: { type: String, default: 'pending' },
    vetPersonnel: { type: String, default: 'Not Set' },
    medicine: { type: String, default: 'Not Set' },
    dosage: { type: String, default: 'Not Set' },
    vetMessage: { type: String, default: 'No message yet' }
    
}, { collection: 'appointments' });

module.exports = mongoose.model('Appointment', appointmentSchema);