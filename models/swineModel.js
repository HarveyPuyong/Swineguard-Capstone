const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    swineFourDigitId: {type: String, required: true, unique: true},
    breed: { type: String, required: true },
    type: { type: String, required: true },
    birthdate: { type: Date, required: true },
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

const swineSchema = mongoose.model('Swine', appointmentSchema);


const swineHealthRecordsSchema = new mongoose.Schema({
    swineId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Swine', 
        required: true  
    },
    monthlyWeight: { type: Number, required: true },
    monthlyStatus: { type: String, default: 'healthy' },
    month: { type: Number, required: true },
    year: { type: Number, required: true },



}, { collection: 'swinesHealthRecords', timestamps: true });

const swineHealthRecordSchema = mongoose.model('SwineHealthRecords', swineHealthRecordsSchema);

module.exports = {
    swineSchema,
    swineHealthRecordSchema
}
