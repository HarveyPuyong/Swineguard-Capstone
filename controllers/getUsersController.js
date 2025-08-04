const { User } = require('../config/role_list');
const UserDB = require('../models/userModel');


// Get User
const getUser = async (req, res) => {
  const userInfo = req?.user;
  console.log(userInfo)
  if(!userInfo) return res.status(401).json({ message: "Unauthorized"});
  
  try{
    const foundUser = await UserDB.findById(userInfo.id).select('-password -refreshToken').lean(); 
    if(!foundUser) return res.status(404).json({ message: "User not found"});

    // Kapag succesfull yung foundUser ay asama ito sa response
    return res.status(200).json({ message: "Authorized", 
                                  "userInfo": foundUser });
  } catch(err){
    console.error(`Error to get the user: ${err}`);
    return res.status(500).json({ message: "Error to get the user"});
  }
}


// Get Users
const getUsers = async (req, res) => {
    try {
      const users = await UserDB.find({ roles: { $nin: ['admin'] } });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

// Get Users by Id
const mongoose = require('mongoose');

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const existingStaff = await UserDB.findById(id);
    if (!existingStaff) {
      return res.status(404).json({ message: 'Staff not found.' });
    }

    res.status(200).json(existingStaff);
  } catch (error) {
    console.error('Error fetching user:', error); // log in backend
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Check existing Email to the system
const checkExistingEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await UserDB.findOne({ email });

    if (existingUser) {
      return res.status(200).json({ exists: true, message: 'Email already exists' });
    } else {
      return res.status(200).json({ exists: false, message: 'Email available' });
    }
  } catch (err) {
    console.error('Error checking email:', err);
    return res.status(500).json({ message: 'Server error while searching for email.' });
  }
};

module.exports = {getUser, getUsers, getUserById, checkExistingEmail};
