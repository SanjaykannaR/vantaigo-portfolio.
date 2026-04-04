const router = require('express').Router();
const { login, verify } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.post('/verify', auth, verify);

module.exports = router;
