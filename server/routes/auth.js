const router = require('express').Router();
const { login, verify, changeCredentials, forgotPassword, resetPassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.post('/verify', auth, verify);
router.put('/change-credentials', auth, changeCredentials);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
