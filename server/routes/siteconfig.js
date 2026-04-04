const router = require('express').Router();
const { get, update } = require('../controllers/siteconfigController');
const auth = require('../middleware/auth');

router.get('/', get);
router.put('/', auth, update);

module.exports = router;
