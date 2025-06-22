// Ang corsOptions na ito ay para payagan lang ang mga request galing sa allowedOrigins na maka-access ng API
const allowedOrigins = require('./allowedOrigins'); 

const corsOptions = {
    origin: (origin, callback) => {
        // Kung ang origin ay nasa allowedOrigins list o walang origin (thunderclient or Postman) papayagan pa din ang access sa API
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { 
            callback(null, true);
        } else{ // Kung hindi allowed ang origin, i-block at mag-throw ng error        
            callback(new Error('Not allowed by CORS'));  
        }
    }, 
    optionsSuccessStatus: 200
}

module.exports = corsOptions; 