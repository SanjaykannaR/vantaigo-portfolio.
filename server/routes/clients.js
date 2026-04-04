const router = require('express').Router();
const { getAll, getById, create, update, delete: deleteClient } = require('../controllers/clientController');
const auth = require('../middleware/auth');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, deleteClient);

module.exports = router;
