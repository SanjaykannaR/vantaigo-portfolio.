const router = require('express').Router();
const { getAll, getAllAdmin, create, update, delete: deleteTestimonial } = require('../controllers/testimonialController');
const auth = require('../middleware/auth');

router.get('/', getAll);
router.get('/admin', auth, getAllAdmin);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, deleteTestimonial);

module.exports = router;
