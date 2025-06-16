require('dotenv').config();

const Express = require('express');
const app = Express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const {logger} =  require('./middlewares/logEvents');
const errorHandler = require('./middlewares/errorHandler');
const credentials = require('./middlewares/credentials');
const corsOptions = require('./config/corsOptions');
const dbConn = require('./config/dbConn');
const PORT = process.env.PORT || 2500;


dbConn.connectDB();

app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(Express.json());

app.use(cookieParser());

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Kupal')
});

// Signup routing
app.use('/signup', require('./routes/signupClientRoute')); 

// Client login outings
app.use('/login', require('./routes/loginClientRoute'));

// Admin login routing
app.use('/admin/login', require('./routes/loginAdminRoute'));

//Messages routing
app.use('/send-message', require('./routes/messageRoute'));


//Inventory routings
app.use('/inventory', require('./routes/inventoryRoute'));

//Appointments routings
app.use('/appointment', require('./routes/appointmentRoute'));

//Ito yung mga link kupal Put ang gamit sa accept marami kase mababago sa loob
//http://localhost:2500/appointment/accept/id ng appointment a copy paste mo dito 

//ganto itsura ng url sa testing
//http://localhost:2500/appointment/accept/684fe1b50bafb6af4c9043bb

// { para sa accept ito ah
//     "appointmentDate": "09-09-2025",
//     "appointmentTime": "10:30",
//     "appointmentStatus": "ongoing",
//     "vetPersonnel": "Dr. Dela Cruz",
//     "medicine": "Ivermectin",
//     "dosage": "100",
//     "vetMessage": "Administer every 12 hours"
// }

// dito ay Patch ang gamit wala ka nang ilalagay sa body nito rekta change na agad yung status sa backend nito para iwas gamit ng dev tools sa webs
//http://localhost:2500/appointment/reschedule/id 
//http://localhost:2500/appointment/remove/id 
//http://localhost:2500/appointment/restore/id
//http://localhost:2500/appointment/complete/id
//http://localhost:2500/appointment/delete/id

//Inventory routing
app.use('/add-item', require('./routes/inventoryRoute'));


//Logout routing
app.use('/logout', require('./routes/logoutRoute'));


mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
  app.listen(PORT, () => console.log(`Server is listen to port: http//localhost:${PORT}`));
});