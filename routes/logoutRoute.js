const Express = require('express');
const router = Express.Router();

router.post('/', require('./../controllers/logoutController'));

module.exports = router;