const router = require('express').Router();
const { getAll, getById, getAllAdmin, create, update, delete: deleteCareer } = require('../controllers/careerController');
const auth = require('../middleware/auth');

router.get('/', getAll);
router.get('/admin', auth, getAllAdmin);
router.get('/:id', getById);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, deleteCareer);

module.exports = router;
