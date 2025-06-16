const Express = require('express');
const router = Express.Router();

router.post('/', require('./../controllers/refreshTokenController'));

module.exports = router;