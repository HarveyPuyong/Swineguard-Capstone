const allowedOrigins = [
  'https://www.examplesite.com', //Ito ay yung mismong frontend link kapag na deploy na
  'http://127.0.0.1:5500', //Local testing using Live Server
  'http://localhost:2500' //Localhost na nagamit sa pag test
];

module.exports = allowedOrigins;