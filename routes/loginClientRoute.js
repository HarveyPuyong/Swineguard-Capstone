const Express = require('express');
const route = Express.Router();

route.post('/', require('../controllers/loginClientController'));

module.exports = route;