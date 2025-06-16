const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    clientId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    swineId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Swine', 
        required: true 
    },

    appointmentTitle: { type: String, required: true },
    appointmentDate: { type: String, required: true  },
    appointmentTime: { type: String, required: true  },
    symptoms: { type: String, required: true  },

    vetPersonnel: { type: String, default: 'Not Set' },
    vetMessage: { type: String, default: 'No message yet' },

    medicine: { type: String, default: 'Not Set' },
    dosage: { type: String, default: 'Not Set' },
       
    appointmentStatus: { type: String, default: 'pending' },
    createdAt: { type: Date, default:Date.now},
    updatedAt: { type: Date, default:Date.now},

    
}, { collection: 'appointments' });

module.exports = mongoose.model('Appointment', appointmentSchema);