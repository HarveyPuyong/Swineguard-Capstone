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
    swineAge: { type: Number, required: true },
    swineMale: { type: Number, required: true },
    swineFemale: { type: Number, required: true },
    
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },

    appointmentStatus: { type: String, default: 'pending' },
    appointmentType: { type: String, required: true },

    underMonitoring: {type: Boolean, required: false},
    healthStatus: {type: String, required: false},
    causeOfDeath: {type: String, required: false},
    numberOfDeaths: {type: Number, required: false},

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
    
    medicineAmount: { type: Number, required: false},
    clinicalSigns: [{ type: String }],
    swineImage: { type: String, required: false },

    
}, { collection: 'appointments', timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);