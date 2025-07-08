const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    suffix: { type: String, required: false },

    birthday: { type: Date, required: false },
    contactNum: { type: String, required: true },
    barangay: { type: String, required: true },
    municipality: { type: String, required: true },
    
    email: { type: String, required: true, unique: true  },
    password: { type: String, required: true },

    isRegistered: { type: Boolean, default: false },

    roles: {
      type: [String],
      default: ['user']
    },
    
    refreshToken: {
      type: [String], 
      default: []
    }

}, { collection: 'users', timestamps: true });

module.exports = mongoose.model('User', userSchema);