const userDB = require('../models/userModel');
const bcrypt = require('bcrypt');
const ROLE_LIST = require('./../config/role_list');

// Edit User Details
const editUserDetails = async (req, res) => {
    const { id } = req.params;
    const  {
        firstName, middleName, lastName, contactNum,
        barangay, municipality, email
    } = req.body;

    console.log(id)

    // Check the id is it is exist
    if (!id) return res.status(400).json({ message: 'User Id not found.' });

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
        return res.status(400).json({ message: 'Please fill out all required fields.'});
    }

    // Validate name fields
    if (!isValidString(firstName, 2, 30)) return res.status(400).json({ message: 'Invalid first name.' });
    if (middleName && !isValidString(middleName, 1, 30)) return res.status(400).json({ message: 'Invalid middle name.' });
    if (!isValidString(lastName, 2, 30)) return res.status(400).json({ message: 'Invalid last name.' });

    // Validate contact number
    if (!contactPattern.test(contactNum)) {
        return res.status(400).json({ message: 'Contact number must start with "09" and be 11 digits long.' });
    }

    // Validate email format
    if (!emailPattern.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    try {
        
        const updatedUser = await userDB.findByIdAndUpdate(id, {
            firstName, middleName, lastName, contactNum,
            barangay, municipality, email
        }, { new: true });

        if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

        res.status(200).json({ message: 'Details updated successfully', user: updatedUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while updating user.' });
    }
}


// Add Technician
const addTechnician = async (req, res) => {
    // nakuha yung json laman ng req.body
    const {firstName, middleName,lastName, suffix,
            municipality, barangay, contactNum } = req.body;

    const email = 'No Email';
    const password = 'pvet_tech';
    
    //ito yung mga required inputs hindi kasama yung suffix kasi optional lang naman yon
    const requiredInputs = [firstName, middleName, lastName, municipality, barangay, contactNum ];

    //ga error kapag hindi na fillupan yung mga required inputs
    if (requiredInputs.some(input => !input)) return res.status(400).json({ message: 'Please fill out all required fields'});
    
    //na check yung contact number kung 09 ang una at naka 11digits, baka kasi mag lagay ng maling number yung client
    const contactPattern = /^09\d{9}$/;
    if (!contactPattern.test(contactNum)) return res.status(400).json({message : 'Contact number must start with "09" and be 11 digits long'});
    
    try{
    const [duplicateFullname] = await Promise.all([
        userDB.findOne({ firstName, middleName, lastName, suffix }).exec(), //binuo ko pala yung fullname hahahha
    ]);

    // Check if the technician is already existed
    if(duplicateFullname) return res.status(409).json({message: "Full name already in use. Try changing the first, middle, or last name"});

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //a create yung newUser sa usersCollection. kupal, ano mas okay na naming userDB o usersCollection?
    const newUser = new userDB(
        {
        "firstName": firstName,
        "middleName": middleName,
        "lastName": lastName,
        "suffix": suffix,
        "municipality":municipality,
        "barangay": barangay,
        "contactNum": contactNum,
        "email": email,
        "password": hashPassword,
        "roles": [ROLE_LIST.Technician]
        }
    );

    await newUser.save();

    //kapag successfull na yung pag create ng client ay ga messsage tapos a asama na din yung accessToken sa response
    return res.status(201).json({message: 'Successfully created Technician', data: newUser});

    } catch(err){ //kapag may error sa try, alam mo na ito
        console.error(`Error: ${err}`); 
        console.log(`Cause of error: ${err.message}`);

        return res.status(500).json({
            message: 'Something went wrong while creating the Technician.',
        });
    }
}


module.exports = {editUserDetails, addTechnician}