const userDB = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.editUserDetails = async (req, res) => {
    const { id } = req.params;
    const  {
        firstName, middleName, lastName, suffix,
        contactNum, barangay, municipality,
        email, password
    } = req.body;

    // Check the id is it is exist
    if (!id) return res.statuas(400).json({ message: 'User Id not found.' });

    // Define regex patterns
    const namePattern = /^[A-Za-z\s\-']+$/; // letters, spaces, hyphens, apostrophes
    const emojiPattern = /[\p{Emoji}\uFE0F]/gu;
    const contactPattern = /^09\d{9}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper to check for emojis or special characters
    const isValidString = (str, min, max) => {
        return (
            str &&
            typeof str === 'string' &&
            str.length >= min &&
            str.length <= max &&
            namePattern.test(str) &&
            !emojiPattern.test(str)
        );
    };

    // Required fields check
    const requiredFields = [firstName, middleName, lastName, contactNum, barangay, municipality, email];
    if (requiredFields.some(field => !field || field.trim() === '')) {
        return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    // Validate name fields
    if (!isValidString(firstName, 2, 30)) return res.status(400).json({ message: 'Invalid first name.' });
    if (middleName && !isValidString(middleName, 1, 30)) return res.status(400).json({ message: 'Invalid middle name.' });
    if (!isValidString(lastName, 2, 30)) return res.status(400).json({ message: 'Invalid last name.' });
    if (suffix && !isValidString(suffix, 1, 10)) return res.status(400).json({ message: 'Invalid suffix.' });

    // Validate contact number
    if (!contactPattern.test(contactNum)) {
        return res.status(400).json({ message: 'Contact number must start with "09" and be 11 digits long.' });
    }

    // Validate email format
    if (!emailPattern.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Optional: Validate password strength if user wants to change it
    let hashedPassword = undefined;
    if (password) {
        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        hashedPassword = await bcrypt.hash(password, 10);
    }

    try {
        
        const updatedUser = await userDB.findByIdAndUpdate(id, {
            firstName, middleName, lastName, suffix,
            contactNum, barangay, municipality,
            email,
            ...(hashedPassword && { password: hashedPassword })
        }, { new: true });

        if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

        res.status(200).json({ message: 'Details updated successfully', user: updatedUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while updating user.' });
    }

}
