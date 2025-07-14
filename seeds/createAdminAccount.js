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

const Tecnician_Email = 'Technician@gmail.com';
const Tecnician_password = 'Technician123';

const mongoURI = process.env.DB_URI || 'mongodb://localhost:27017/swineguard_db';

(async () => {
    await mongoose.connect(mongoURI);
    
    const existingAdminAcc = await User.findOne({email: adminEmail});
    const existingAC_staffAcc = await User.findOne({email: AC_staff_Email});
    const existingIC_staffAcc = await User.findOne({email: IC_staff_Email});
    const existingTecnician_Acc = await User.findOne({email: Tecnician_Email});

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
                birthday: "01-01-1999",

                email: adminEmail, 
                password: hashedPassword,
                roles: [ROLE_LIST.Admin]
            }
        );
    
        await newAdmin.save();

        console.log('✅ Admin account created successfully.');
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
                birthday: "01-01-1999",

                email: AC_staff_Email, 
                password: hashed_ACstaff_password,
                roles: [ROLE_LIST.AppointmentCoordinator]
            }
        );

        await newAdmin_AC.save();

        console.log('✅ Appointment Coordinator account created successfully.');
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
                birthday: "01-01-1999",

                email: IC_staff_Email, 
                password: hashed_ICstaff_password,
                roles: [ROLE_LIST.InventoryCoordinator]
            }
        );

        await newAdmin_IC.save();

        console.log('✅ Inventory Coordinator account created successfully.');
    }  else {
        console.log('⚠️ Account already exists');
    }


    // Generating Tecnician Account
    if (!existingTecnician_Acc) {
        const hashed_Tecnician_password = await bcrypt.hash(Tecnician_password, 10);
        const newAdmin_Tecnician = await User.create(
            { 
                firstName: "Mark Carlo",
                middleName: "N",
                lastName: "Naling",
                suffix: "Jr",

                municipality: "Boac",
                barangay: "Santol",
                contactNum: "09266495922",
                birthday: "01-01-1999",

                email: Tecnician_Email, 
                password: hashed_Tecnician_password,
                roles: [ROLE_LIST.Technician]
            }
        );

        await newAdmin_Tecnician.save();

        console.log('✅ Tecnician account created successfully.');
    }  else {
        console.log('⚠️ Account already exists');
    }
    mongoose.disconnect();
})();