const router = require('express').Router();
const ctrl = require('../controllers/hrmsController');
const auth = require('../middleware/auth');           // admin auth
const hrmsAuth = require('../middleware/hrmsAuth');   // employee auth

// ── Employee login (public) ──────────────────────────────────────────────────
router.post('/employee-login', ctrl.employeeLogin);

// ── Verify employee token ────────────────────────────────────────────────────
router.post('/employee-verify', hrmsAuth, ctrl.verifyEmployee);

// ── Employee CRUD (admin only) ───────────────────────────────────────────────
router.get('/employees', auth, ctrl.getAllEmployees);
router.post('/employees', auth, ctrl.createEmployee);
router.put('/employees/:id', auth, ctrl.updateEmployee);
router.put('/employees/:id/reset-password', auth, ctrl.resetEmployeePassword);
router.delete('/employees/:id', auth, ctrl.deleteEmployee);

// ── Attendance — employee marks own ─────────────────────────────────────────
router.post('/attendance', hrmsAuth, ctrl.markAttendance);
router.get('/attendance/my', hrmsAuth, ctrl.getMyAttendance);

// ── Attendance — admin views/edits all ──────────────────────────────────────
router.get('/attendance', auth, ctrl.getAllAttendance);
router.post('/attendance/admin', auth, ctrl.adminMarkAttendance);

// ── Work Items — employee manages own ───────────────────────────────────────
router.get('/workitems/my', hrmsAuth, ctrl.getMyWorkItems);
router.post('/workitems', hrmsAuth, ctrl.createWorkItem);
router.put('/workitems/:id', hrmsAuth, ctrl.updateWorkItem);
router.delete('/workitems/:id', hrmsAuth, ctrl.deleteWorkItem);

// ── Work Items — admin views/manages all ────────────────────────────────────
router.get('/workitems', auth, ctrl.getAllWorkItems);
router.post('/workitems/admin', auth, ctrl.createWorkItem);     // admin creates task for employee
router.put('/workitems/admin/:id', auth, ctrl.updateWorkItem);
router.delete('/workitems/admin/:id', auth, ctrl.deleteWorkItem);

module.exports = router;
