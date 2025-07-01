const userDB = require('./../models/userModel');
const messageDB = require('./../models/messageModel');
const appointmentDB = require('./../models/appointmentModel');
const inventoryDB = require('./../models/inventoryModel');
const mongoose = require('mongoose');

// User Id for message
async function verifySenderReceiverId(senderId, receiverId) {
    // Check Id if valid
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return false;
    }

    const existingSenderId = await userDB.findById(senderId);
    const existingReceiverId = await userDB.findById(receiverId);

    return !!existingSenderId && !!existingReceiverId;
}

// Appointment Id checking
async function verifyAppointmentId (id) {
    // Check Id if valid
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    //Db if id exist
    const existingAppointmentId = await appointmentDB.findById(id);
    return !!existingAppointmentId;
}

// Inventory item Id checking
async function verifyItemId (id) {
    // Check Id if valid
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    //Db if id exist
    const existingItemId = await inventoryDB.findById(id);
    return !!existingItemId;
}



module.exports = { verifySenderReceiverId}