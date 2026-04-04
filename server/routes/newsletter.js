const router = require('express').Router();
const { subscribe, getAll, delete: deleteSubscriber, exportCSV } = require('../controllers/newsletterController');
const auth = require('../middleware/auth');

router.post('/subscribe', subscribe);
router.get('/', auth, getAll);
router.get('/export', auth, exportCSV);
router.delete('/:id', auth, deleteSubscriber);

module.exports = router;
