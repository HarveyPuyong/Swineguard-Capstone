// Dito ay naglagay ako ng allowedOrigins para ito lang ang mga link na papayagang makakonek sa server
const allowedOrigins = [
  'https://www.examplesite.com', //Ito ay yung mismong frontend link kapag na deploy na
  'http://127.0.0.1:5500', //Local testing using Live Server
  `http://localhost:${process.env.PORT}` //Localhost na nagamit sa pag test
];

module.exports = allowedOrigins;