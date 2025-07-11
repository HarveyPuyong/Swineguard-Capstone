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

    clientFirstname: { type: String, required: true },
    clientLastname: { type: String, required: true },
    contactNum: { type: String, required: true },
    municipality: { type: String, require: true},
    barangay: { type: String, require: true},
    clientEmail: { type: String, default: 'no email' },

    appointmentTitle: { type: String, required: true },
    swineType: { type: String, required: true },
    swineCount: { type: Number, required: true },
    swineSymptoms: { type: String, required: true },
    swineAge: { type: Number, required: true },
    swineMale: { type: Number, required: true },
    swineFemale: { type: Number, required: true },
    
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },

    appointmentStatus: { type: String, default: 'pending' },
    appointmentType: { type: String, required: true },

    vetPersonnel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false,
    },

    medicine: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Inventory', 
        required: false,
    },
    dosage: { type: String, default: 'not set' },
    vetMessage: { type: String, default: 'no set' }

    
}, { collection: 'appointments', timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);