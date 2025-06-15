const Express = require('express');
const route = Express.Router();

route.post('/', require('./../controllers/logoutController'));

module.exports = route;