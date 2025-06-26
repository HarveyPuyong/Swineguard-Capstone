const allowedOrigins = require('./../config/allowedOrigins');

// make middleware credentials para ang nasa allowed origins lang ang maka access ng cookies at headers sa response. 
// Kahit sinong website (kahit attacker) ay puwedeng magpadala ng request at makatanggap ng cookies/session info — which is a security risk 

const credentials = (req, res, next) => {
  const origin = req.headers.origin; 
  if(allowedOrigins.includes(origin)){ 
    res.header('Access-Control-Allow-Credentials', true);
    console.log(`Origin allowed for credentials: ${origin}`);
  };

  next();
}


module.exports = credentials;