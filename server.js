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

app.use(Express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
  return res.redirect('/admin/login.html');

});

app.use('/auth', require('./routes/authRoute'));

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

//Logout routing
app.use('/auth', require('./routes/logoutRoute'));

//Pang Test Lang ito boi
app.use('/test', Express.static(path.join(__dirname, 'test')));

// Optional: serve message.html directly at a route
app.get('/message', (req, res) => {
  res.sendFile(path.join(__dirname, 'test', 'message.html'));
});

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
  app.listen(PORT, () => console.log(`Server is listen to port: http://localhost:${PORT}`));
});