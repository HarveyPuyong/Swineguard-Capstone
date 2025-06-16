const Express = require('express');
const route = Express.Router();

route.post('/', require('./../controllers/loginAdminController'));

module.exports = route;