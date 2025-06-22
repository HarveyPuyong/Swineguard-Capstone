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

                municipality: "Boac",
                barangay: "Bangbangalon",
                contactNum: "09503505396",

                email: adminEmail, 
                password: hashedPassword,
                roles: [ROLE_LIST.Admin]
            }
        );

        // gumawa ako ng userName para lang alagay ko sa tokens
        const userName = `${newAdmin.firstName}, ${newAdmin.lastName}`
    
        //nasa utils folder pala ngani yung generateAccessToke function, don ko nalagay yung mga reuseable functions
        const accessToken = generateAccessToken(process.env.ACCESS_TOKEN_SECRET,
                                                process.env.ACCESS_TOKEN_EXPIRY,
                                                newAdmin._id,
                                                userName,
                                                newAdmin.roles
        );
        
        //ito din nasa utils folder magkasama sila ng generate access token sa generateTokens.js
        const refreshToken = generateRefreshToken(process.env.REFRESH_TOKEN_SECRET,
                                                    process.env.REFRESH_TOKEN_EXPIRY,
                                                    newAdmin._id, 
                                                    userName,
        );
    
        // na store yung generated refrechToken sa newClient
        newAdmin.refreshToken = [refreshToken];

        await newAdmin.save();

        console.log('✅ Admin account created successfully.');
        console.log('Admin Access Token: ', accessToken);
    } 


    // Generating Appointment Coordinator Account
    if (!existingAC_staffAcc) {
        const hashed_ACstaff_password = await bcrypt.hash(AC_staff_password, 10);
        const newAdmin_AC = new User(
            {
                firstName: "Robert",
                middleName: "M",
                lastName: "Magno",
                suffix: "",

                municipality: "Gasan",
                barangay: "Mahunig",
                contactNum: "09266495922",

                email: AC_staff_Email, 
                password: hashed_ACstaff_password,
                roles: [ROLE_LIST.AppointmentCoordinator]
            }
        );

        // gumawa ako ng userName para lang alagay ko sa tokens
        const userName = `${newAdmin_AC.firstName}, ${newAdmin_AC.lastName}`
    
        //nasa utils folder pala ngani yung generateAccessToke function, don ko nalagay yung mga reuseable functions
        const accessToken = generateAccessToken(process.env.ACCESS_TOKEN_SECRET,
                                                process.env.ACCESS_TOKEN_EXPIRY,
                                                newAdmin_AC._id,
                                                userName,
                                                newAdmin_AC.roles
        );
        
        //ito din nasa utils folder magkasama sila ng generate access token sa generateTokens.js
        const refreshToken = generateRefreshToken(process.env.REFRESH_TOKEN_SECRET,
                                                    process.env.REFRESH_TOKEN_EXPIRY,
                                                    newAdmin_AC._id, 
                                                    userName,
        );
    
        // na store yung generated refrechToken sa newClient
        newAdmin_AC.refreshToken = [refreshToken];

        await newAdmin_AC.save();

        console.log('✅ Appointment Coordinator account created successfully.');
        console.log('AC Admin Access Token: ', accessToken);
    } 


    // Generating Inventory Coordinator Account
    if (!existingIC_staffAcc) {
        const hashed_ICstaff_password = await bcrypt.hash(IC_staff_password, 10);
        const newAdmin_IC = await User.create(
            { 
                firstName: "John Harvey",
                middleName: "A",
                lastName: "Puyong",
                suffix: "Jr",

                municipality: "Boac",
                barangay: "Maligaya",
                contactNum: "09266495922",

                email: IC_staff_Email, 
                password: hashed_ICstaff_password,
                roles: [ROLE_LIST.InventoryCoordinator]
            }
        );

        // gumawa ako ng userName para lang alagay ko sa tokens
        const userName = `${newAdmin_IC.firstName}, ${newAdmin_IC.lastName}`
    
        //nasa utils folder pala ngani yung generateAccessToke function, don ko nalagay yung mga reuseable functions
        const accessToken = generateAccessToken(process.env.ACCESS_TOKEN_SECRET,
                                                process.env.ACCESS_TOKEN_EXPIRY,
                                                newAdmin_IC._id,
                                                userName,
                                                newAdmin_IC.roles
        );
        
        //ito din nasa utils folder magkasama sila ng generate access token sa generateTokens.js
        const refreshToken = generateRefreshToken(process.env.REFRESH_TOKEN_SECRET,
                                                    process.env.REFRESH_TOKEN_EXPIRY,
                                                    newAdmin_IC._id, 
                                                    userName,
        );
    
        // na store yung generated refrechToken sa newClient
        newAdmin_IC.refreshToken = [refreshToken];

        await newAdmin_IC.save();

        console.log('✅ Inventory Coordinator account created successfully.');
        console.log('IC Admin Access Token: ', accessToken);

    }  else {
        console.log('⚠️ Account already exists');
    }
    mongoose.disconnect();
})();