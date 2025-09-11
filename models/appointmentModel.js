const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    clientId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false,
    },
    swineIds: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Swine',
        required: false,
    }],

    clientFirstname: { type: String, required: true },
    clientLastname: { type: String, required: true },
    contactNum: { type: String, required: true },
    municipality: { type: String, require: true},
    barangay: { type: String, require: true},
    clientEmail: { type: String, default: 'no email' },

    appointmentService: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        required: true,
    },

    swineType: { type: String, required: true },
    swineCount: { type: Number, required: true },
    swineSymptoms: { type: String, required: false },
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
    
    medicineAmount: { type: Number, default: 'not set' },
    clinicalSigns: [{ type: String }],

    
}, { collection: 'appointments', timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);