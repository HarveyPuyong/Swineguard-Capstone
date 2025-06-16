const Express = require('express');
const router = Express.Router();

router.post('/', require('./../controllers/signupClientController'));

module.exports = router