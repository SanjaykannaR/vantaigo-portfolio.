const router = require('express').Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

router.post('/', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: 'Upload error', error: error.message });
  }
});

module.exports = router;
