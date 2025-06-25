const Express = require('express');
const router = Express.Router();

router.get('/', require('./../controllers/refreshTokenController'));

module.exports = router;