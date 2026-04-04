const router = require('express').Router();
const { getAll, create, update, delete: deleteService } = require('../controllers/serviceController');
const auth = require('../middleware/auth');

router.get('/', getAll);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, deleteService);

module.exports = router;
