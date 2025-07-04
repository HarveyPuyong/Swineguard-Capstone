const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    breed: { type: String, required: true },
    type: { type: String, required: true },
    birthdate: { type: String, required: true },
    sex: { type: String, required: true },
    weight: { type: Number, required: true },
    status: { type: String, default: 'healthy' },
    cause: { type: String, default: 'none' },

    clientId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }

    
}, { collection: 'swines', timestamps: true });

module.exports = mongoose.model('Swine', appointmentSchema);