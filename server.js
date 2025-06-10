const Express = require('express');
const app = Express();
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const {logger} =  require('./middlewares/logEvents');
const errorHandler = require('./middlewares/errorHandler');
const credentials = require('./middlewares/credentials');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 2500;


app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(Express.json());

app.use(cookieParser());

app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Hello')
});

app.listen(PORT, () => {
  console.log(`server is running on port: http://localhost:${PORT}`)
});