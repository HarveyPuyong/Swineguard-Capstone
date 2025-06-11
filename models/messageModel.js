const mongoose = require('mongoose');

const messageModel = new mongoose.Schema({

    content: { type: String, required: true },

    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    dateSend: {  type: Date, default:Date.now }
    

}, { collection: 'message_tbl' });

module.exports = mongoose.model('Message', messageModel);