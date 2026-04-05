const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true,
  },
  company: {
    type: String,
    trim: true,
    default: '',
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  contactNumber: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  // Social / portfolio links
  linkedin: { type: String, trim: true, default: '' },
  instagram: { type: String, trim: true, default: '' },
  portfolioWebsite: { type: String, trim: true, default: '' },

  // File storage — currently local path/filename.
  // To migrate to cloud (Cloudinary/S3): replace this value with the remote URL.
  // The controller abstracts the storage layer via a StorageService interface.
  resumeFile: { type: String, default: '' },         // file path or cloud URL
  resumeFileOriginalName: { type: String, default: '' }, // original filename
  resumeFileSizeBytes: { type: Number, default: 0 },

  // Source: 'admin' or 'hrms' (tracks who added it)
  addedBy: {
    type: String,
    enum: ['admin', 'hrms'],
    default: 'admin',
  },
  // Which HRMS employee added it (if addedBy = hrms)
  addedByEmployeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null,
  },

  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
