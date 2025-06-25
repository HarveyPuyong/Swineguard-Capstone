const messageDB = require('../models/messageModel');

// Send Messages
exports.sendMessage = async (req, res) => {

    const {sender, receiver, content} = req.body;
    const messageInputs = [sender, receiver, content];

    // Check the messages inputs
    if (messageInputs.some(input => !input)) return res.status(400).json({ message: 'Please input a message'});

    try {
        // Get sender from the authenticated user (decoded token) yung nasa verifyJWT.js
        //const sender = req.user.id; activate mo na lang ito kpg may frontend na kupal/ hahaha sige

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
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
