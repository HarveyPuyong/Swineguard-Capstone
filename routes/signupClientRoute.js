const Express = require('express');
const route = Express.Router();

route.post('/', require('./../controllers/signupClientController'));

module.exports = route