const router = require('express').Router();
const { getAll, getBySlug, getAllAdmin, create, update, delete: deletePost } = require('../controllers/blogController');
const auth = require('../middleware/auth');

router.get('/', getAll);
router.get('/admin', auth, getAllAdmin);
router.get('/:slug', getBySlug);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, deletePost);

module.exports = router;
