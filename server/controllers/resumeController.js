const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');

// ─── List all resumes ────────────────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const resumes = await Resume.find()
      .sort({ createdAt: -1 })
      .populate('addedByEmployeeId', 'name employeeId');
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Create resume ───────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const data = { ...req.body };

    // Attach file info if uploaded
    if (req.file) {
      data.resumeFile = `/uploads/resumes/${req.file.filename}`;
      data.resumeFileOriginalName = req.file.originalname;
      data.resumeFileSizeBytes = req.file.size;
    }

    const resume = new Resume(data);
    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(400).json({ message: 'Error creating resume', error: error.message });
  }
};

// ─── Update resume ───────────────────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const existing = await Resume.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Resume not found' });

    const data = { ...req.body };

    // If a new file was uploaded, delete the old one and update fields
    if (req.file) {
      if (existing.resumeFile) {
        const oldPath = path.join(__dirname, '..', existing.resumeFile);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.resumeFile = `/uploads/resumes/${req.file.filename}`;
      data.resumeFileOriginalName = req.file.originalname;
      data.resumeFileSizeBytes = req.file.size;
    }

    const updated = await Resume.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating resume', error: error.message });
  }
};

// ─── Delete resume ───────────────────────────────────────────────────────────
exports.delete = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // Delete file from disk
    // FUTURE CLOUD MIGRATION: replace this block with Cloudinary/S3 delete call
    if (resume.resumeFile) {
      const filePath = path.join(__dirname, '..', resume.resumeFile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
