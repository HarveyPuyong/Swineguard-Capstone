const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    receiver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    seen: { type: Boolean, default: false },
    content: { type: String, required: true },
    dateSend: {  type: Date, default:Date.now }

}, { collection: 'messages' });

module.exports = mongoose.model('Message', messageSchema);