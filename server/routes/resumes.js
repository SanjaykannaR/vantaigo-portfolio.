const router = require('express').Router();
const ctrl = require('../controllers/resumeController');
const auth = require('../middleware/auth');
const hrmsAuth = require('../middleware/hrmsAuth');
const { resumeUpload } = require('../middleware/fileUpload');

// Combined middleware — accepts either admin token or employee token
const anyAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type === 'employee') {
      req.employeeId = decoded.id;
      req.employeeMongoId = decoded.mongoId;
    } else {
      req.adminId = decoded.id;
    }
    next();
  } catch {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin-only: get, update, delete
router.get('/', auth, ctrl.getAll);
router.put('/:id', auth, resumeUpload.single('resumeFile'), ctrl.update);
router.delete('/:id', auth, ctrl.delete);

// Both admin and HRMS employee can add resumes
router.post('/', anyAuth, resumeUpload.single('resumeFile'), ctrl.create);

module.exports = router;
