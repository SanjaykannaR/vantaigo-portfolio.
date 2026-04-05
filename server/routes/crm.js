const router = require('express').Router();
const ctrl = require('../controllers/crmController');
const auth = require('../middleware/auth'); // CRM uses admin credentials
const { crmUpload } = require('../middleware/fileUpload');

// Overall Reports
router.get('/reports', auth, ctrl.getReports);

// All CRM routes require admin authentication
router.get('/', auth, ctrl.getAll);
router.post('/', auth, ctrl.create);
router.get('/:id', auth, ctrl.getOne);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.delete);

// Secure file management (auth-gated download — never public URL)
router.post('/:id/files', auth, crmUpload.single('file'), ctrl.uploadFile);
router.get('/:id/files/:fileId/download', auth, ctrl.downloadFile);
router.delete('/:id/files/:fileId', auth, ctrl.deleteFile);

// Feedback
router.post('/:id/feedback', auth, ctrl.addFeedback);
router.delete('/:id/feedback/:fbId', auth, ctrl.deleteFeedback);

// Positions
router.post('/:id/positions', auth, ctrl.addPosition);
router.put('/:id/positions/:posId', auth, ctrl.updatePosition);
router.delete('/:id/positions/:posId', auth, ctrl.deletePosition);

// Software Projects
router.post('/:id/software', auth, ctrl.addSoftwareProject);
router.put('/:id/software/:projId', auth, ctrl.updateSoftwareProject);
router.delete('/:id/software/:projId', auth, ctrl.deleteSoftwareProject);

module.exports = router;
