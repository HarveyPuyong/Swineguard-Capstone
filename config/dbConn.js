// Alam mo naman na yata kung ano ito hahahaha
const mongoose = require('mongoose');
const mongoURI = process.env.USERDB_URI || 'mongodb://localhost:27017/swineguard_db';
const connectDB = async() => {
  try{
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to the database');
  } catch(err) {
    console.log("❌ Connection failed:",err);
  }
}


module.exports = {connectDB}