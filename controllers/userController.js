const userDB = require('../models/userModel');
const bcrypt = require('bcrypt');
const ROLE_LIST = require('./../config/role_list');
const { isValidInput, containsEmoji, hasNumber, containsSpecialChar }= require('./../utils/inputChecker');
const {generateAccessToken, generateRefreshToken} = require('./../utils/generateTokens');

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

    // Check for Emojis
    if (containsEmoji(firstName) || containsEmoji(middleName) || containsEmoji(lastName)) {
    return res.status(400).json({ message: 'Emoji are not allowed for service name.'});
    }

    // Check for Numbers
    if (hasNumber(firstName) || hasNumber(middleName) || hasNumber(lastName)) {
    return res.status(400).json({ message: 'Numbers are not allowed.'});
    }

    // Check for Special Chracters
    if (containsSpecialChar(firstName) || containsSpecialChar(middleName) || containsSpecialChar(lastName)) {
    return res.status(400).json({ message: 'Special characters are not allowed.'});
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


// Add Staffs
const addStaff = async (req, res) => {
    const {firstName, middleName,lastName, suffix, role,
            municipality, barangay, contactNum,
            email, password, confirmPassword, 
        } = req.body;

    // Check the length of inputs
    if (!isValidInput(firstName) || !isValidInput(lastName)) {
    return res.status(400).json({ message: 'Please provide valid and longer input.'});
    }
    // Check for Emojis
    if (containsEmoji(firstName) || containsEmoji(middleName) || containsEmoji(lastName)) {
    return res.status(400).json({ message: 'Emoji are not allowed for name.'});
    }

    // Check for Numbers
    if (hasNumber(firstName) || hasNumber(middleName) || hasNumber(lastName)) {
    return res.status(400).json({ message: 'Numbers are not allowed for name'});
    }

    // Check for Special Chracters
    if (containsSpecialChar(firstName) || containsSpecialChar(middleName) || containsSpecialChar(lastName)) {
    return res.status(400).json({ message: 'Special characters are not allowed.'});
    }

    try{
    const [duplicateFullname] = await Promise.all([
        userDB.findOne({ firstName, middleName, lastName, suffix }).exec(), 
    ]);

    // Check if the staff is already existed
    if(duplicateFullname) return res.status(409).json({message: "Full name already in use. Try changing the first, middle, or last name"});

    //na check kung yung password at confirmPassword ay tama
    if(password.trim() !== confirmPassword.trim()) return res.status(400).json({message: 'Passowords does not match'});

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
        "roles":  role,
        "isRegistered": true
        }
    );

    // gumawa ako ng userName para lang alagay ko sa tokens
    const userName = `${newUser.firstName}, ${newUser.lastName}`;

    //nasa utils folder pala ngani yung generateAccessToke function, don ko nalagay yung mga reuseable functions
    const accessToken = generateAccessToken(process.env.ACCESS_TOKEN_SECRET,
                                            process.env.ACCESS_TOKEN_EXPIRY,
                                            newUser._id,
                                            userName,
                                            newUser.roles
    );
    
    //ito din nasa utils folder magkasama sila ng generate access token sa generateTokens.js
    const refreshToken = generateRefreshToken(process.env.REFRESH_TOKEN_SECRET,
                                                process.env.REFRESH_TOKEN_EXPIRY,
                                                newUser._id, 
                                                userName,
    );

    // na store yung generated refrechToken sa newUser
    newUser.refreshToken = [refreshToken];

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


// Get Personnel for Appointments
const getTechandVets = async (req, res) => {
    try {
        const staff = await userDB.find({ roles: { $in: ['technician', 'veterinarian'] } });
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Get all Staffs
const getAllStaffs = async (req, res) => {
    try {
        const staff = await userDB.find({ roles: { $ne: 'user' } });
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Verify user account
const verifyUserAccount = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userDB.findByIdAndUpdate(
            id,
            { isRegistered: true },
            {new: true}
        );
        if(!user) return res.status(404).json({ message: 'User Id not found.' });

        res.status(200).json({ message: 'User verified successfully.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while verifying user.' });
    }
}

// Verify 4 digit OTP code
const verifyOTP = async (req, res) => {

    const email = req.body.email?.trim();
    const otp = req.body.otp?.trim();

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found.' });

    // Check OTP and expiration
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    // OTP is valid
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: 'OTP verified successfully. Waiting for vet approval.' });

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = {
    editUserDetails, 
    addStaff, 
    getTechandVets, 
    getAllStaffs, 
    verifyUserAccount, 
    verifyOTP};