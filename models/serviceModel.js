const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({

    serviceName: { type: String, required: true },
    description: { type: String, required: true },

    applicableItemTypes: [{ type: String }],
    serviceType: { type: String, required: true}

}, { collection: 'services', timestamps: true });   

module.exports = mongoose.model('Service', serviceSchema);