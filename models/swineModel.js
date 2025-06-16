const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    breed: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    weight: { type: Number, required: true },
    healthStatus: { type: String, default: 'healthy' },

    clientId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { type: Date, default:Date.now},
    updatedAt: { type: Date, default:Date.now},

    
}, { collection: 'swines' });

module.exports = mongoose.model('Swine', appointmentSchema);