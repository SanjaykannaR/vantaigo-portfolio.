const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─────────────────────────────────────────
// STORAGE ABSTRACTION LAYER
// Currently: local disk storage
// Future migration: replace only this section with Cloudinary/S3 adapter
// The controller code remains unchanged — only storagePath & URL generation changes
// ─────────────────────────────────────────

const RESUME_MAX_MB = 5;
const CRM_MAX_MB = 10;

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// ── Resume upload (PDF, DOC, DOCX — max 5 MB) ──────────────────────────────
const resumeDir = path.join(__dirname, '..', 'uploads', 'resumes');
ensureDir(resumeDir);

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, resumeDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const resumeFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = /pdf|msword|officedocument/.test(file.mimetype);
  if (ext || mime) return cb(null, true);
  cb(new Error('Only PDF, DOC, DOCX files allowed for resumes'));
};

const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: RESUME_MAX_MB * 1024 * 1024 },
  fileFilter: resumeFilter,
});

// ── CRM secure file upload (Excel, CSV, DOCX, PDF — max 10 MB) ─────────────
const crmDir = path.join(__dirname, '..', 'uploads', 'crm');
ensureDir(crmDir);

const crmStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, crmDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const crmFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|xls|xlsx|csv/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) return cb(null, true);
  cb(new Error('Only PDF, DOC, DOCX, XLS, XLSX, CSV allowed for CRM files'));
};

const crmUpload = multer({
  storage: crmStorage,
  limits: { fileSize: CRM_MAX_MB * 1024 * 1024 },
  fileFilter: crmFilter,
});

module.exports = { resumeUpload, crmUpload };
