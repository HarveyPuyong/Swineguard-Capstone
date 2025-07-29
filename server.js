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

app.use(Express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  return res.redirect('/admin/login.html');

});

// app.get('/client-login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend', 'client', 'login.html'));
// });

// Auth Routing User
app.use('/auth', require('./routes/authRoute'));

//Logout routing
app.use('/logout', require('./routes/logoutRoute'));

// Refresh token routing
app.use('/refresh', require('./routes/refreshTokenRoute'));

//Messages routing
app.use('/message', require('./routes/messageRoute'));

//Appointments routings
app.use('/appointment', require('./routes/appointmentRoute'));

//Inventory routing
app.use('/inventory', require('./routes/inventoryRoute'));

// Swine routing
app.use('/swine', require('./routes/swineRoute'));

// Services routing
app.use('/service', require('./routes/serviceRoute'));

// Get user routing
app.use('/', require('./routes/userRoute'));

// Get report routing
app.use('/report', require('./routes/reportRoute'));

//Pang Test Lang ito boi
app.use('/test', Express.static(path.join(__dirname, 'test')));

// Optional: serve message.html directly at a route
app.get('/message', (req, res) => {
  res.sendFile(path.join(__dirname, 'test', 'message.html'));
});


app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
  app.listen(PORT, () => console.log(`Server is listen to port: http://localhost:${PORT}`));
});