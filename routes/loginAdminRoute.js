const Express = require('express');
const router = Express.Router();

router.post('/', require('./../controllers/loginAdminController'));

module.exports = router;