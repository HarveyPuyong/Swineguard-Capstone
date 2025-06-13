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

//kapag ga test ka, ito alagay mo sa url ng postman or thunder client👉 http://localhost:2500/signup "post" yung request
app.use('/signup', require('./routes/signupClientRoute')); 

//ito ay para sa messages
app.use('/send-message', require('./routes/messageRoute'));

//Invtory routings
app.use('/add-item', require('./routes/inventoryRoute'));

mongoose.connection.once('open', () => {
  console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
  app.listen(PORT, () => console.log(`Server is listen to port: http//localhost:${PORT}`));
});