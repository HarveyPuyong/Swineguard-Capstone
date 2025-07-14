require('dotenv').config();

const bcrypt = require('bcrypt');
const {generateAccessToken, generateRefreshToken} = require('./../utils/generateTokens');

const User = require('./../models/userModel');
const ROLE_LIST = require('./../config/role_list');
const { default: mongoose } = require('mongoose');

const adminEmail = 'marinduque.pvet@gmail.com';
const adminPassword = 'ADMIN123';

const AC_staff_Email = 'ACstaff@gmail.com';
const AC_staff_password = 'ACADMIN123';

const IC_staff_Email = 'ICstaff@gmail.com';
const IC_staff_password = 'ICADMIN123';

const mongoURI = process.env.DB_URI || 'mongodb://localhost:27017/swineguard_db';

(async () => {
    await mongoose.connect(mongoURI);
    
    const existingAdminAcc = await User.findOne({email: adminEmail});
    const existingAC_staffAcc = await User.findOne({email: AC_staff_Email});
    const existingIC_staffAcc = await User.findOne({email: IC_staff_Email});

    if (!existingAdminAcc) {
        // Generating Administrator Account
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const newAdmin = new User(
            { 
                firstName: "Provincial",
                middleName: "Veterinary",
                lastName: "Office",
                suffix: "",
                sex: "none",

                municipality: "Boac",
                barangay: "Bangbangalon",
                contactNum: "09503505396",
                birthday: "01-01-1999",

                email: adminEmail, 
                password: hashedPassword,
                roles: [ROLE_LIST.Admin]
            }
        );
    
        await newAdmin.save();

        console.log('✅ Admin account created successfully.');
    } 

    mongoose.disconnect();
})();