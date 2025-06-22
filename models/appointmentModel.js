const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    clientId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false,
    },
    swineId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Swine', 
        required: false,
    },

    clientName: { type: String, required: true },
    contactNum: { type: String, required: true },
    municipality: { type: String,},
    barangay: { type: String,},
    clientEmail: { type: String, default: 'No email' },

    appointmentTitle: { type: String, required: true },
    swineType: { type: String, required: true },
    swineCount: { type: Number, required: true },
    swineSymptoms: { type: String, required: true },
    swineAge: { type: Number, required: true },
    swineMale: { type: Number, required: true },
    swineFemale: { type: Number, required: true },
    
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },

    appointmentStatus: { type: String, default: 'pending' },
    vetPersonnel: { type: String, default: 'Not Set' },
    medicine: { type: String, default: 'Not Set' },
    dosage: { type: String, default: 'Not Set' },
    vetMessage: { type: String, default: 'No message yet' }

    
}, { collection: 'appointments', timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);