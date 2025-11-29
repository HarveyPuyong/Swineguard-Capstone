const mongoose = require('mongoose');

const verificationImageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageUrl: { type: String, required: false },

}, { timestamps: true });

module.exports = mongoose.model('verificationImages', verificationImageSchema);