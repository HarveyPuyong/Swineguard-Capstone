const messageDB = require('../models/messageModel');
const { isValidInput } = require('./../utils/verifyInput');
const { verifySenderReceiverId, verifyAppointmentId, verifyItemId } = require('./../utils/verifyId');

// Send Messages
exports.sendMessage = async (req, res) => {

    const {sender, receiver, content} = req.body;
    const messageInputs = [sender, receiver, content];

    // Check the messages inputs
    if (!isValidInput(content)) return res.status(400).json({ message: 'Please input a longer message'});

    if(messageInputs.some(input => !input)) return res.status(400).json({ message: 'Please input a longer message'});

    // check user ID
    // const isValidId = await verifySenderReceiverId(sender, receiver);
    // if(!isValidId) return res.status(400).json({ message: 'Sender and Receiver Id are not Exist'});

    try {
        // Check if sender and receiver id exist

        const newMessage = new messageDB ({
            sender,
            receiver,
            content
        });

        await newMessage.save();

        return res.status(201).json({message: "Message sent."});

    } catch (err) {
        console.error(`Error: ${err}`); 
        console.log(`Cause of error: ${err.message}`);

        return res.status(500).json({
            message: 'Something went wrong while sending messages.',
        });
    }
}

// Fecth all Messages 
exports.getMessages = async (req, res) => {
    try {
        const messages = await messageDB.find();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Fetch Messages by id of Sender
exports.getUserMessages = async (req, res) => {
    const {id} = req.params;// message id
    try {
        const messages = await messageDB.find({ sender: id });

        if (!messages) return res.status(404).json({ message: "Message not found." });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
