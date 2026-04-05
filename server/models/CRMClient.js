const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  count: { type: Number, default: 1 },
  description: { type: String, default: '' },
  isPending: { type: Boolean, default: true },
  revenue: { type: Number, default: 0 },
}, { _id: true });

const softwareProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  revenue: { type: Number, default: 0 },
}, { _id: true });

const feedbackSchema = new mongoose.Schema({
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  date: { type: Date, default: Date.now },
  source: { type: String, default: '' }, // who gave the feedback
}, { _id: true });

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  storedName: { type: String, required: true }, // local filename or cloud key
  // Cloud migration note:
  // For local: storedPath = 'uploads/crm/<filename>'
  // For Cloudinary: storedPath = cloudinary secure_url, storageType = 'cloudinary'
  storedPath: { type: String, required: true },
  storageType: { type: String, enum: ['local', 'cloudinary', 's3'], default: 'local' },
  mimeType: { type: String, default: '' },
  sizeBytes: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now },
}, { _id: true });

const crmClientSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  about: {
    type: String,
    default: '',
  },
  officialWebsite: {
    type: String,
    trim: true,
    default: '',
  },
  trackingLink: {
    type: String,
    trim: true,
    default: '',
  },
  industry: {
    type: String,
    trim: true,
    default: '',
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  contactPhone: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['prospect', 'active', 'on-hold', 'closed'],
    default: 'prospect',
  },
  requestedPositions: [positionSchema],
  softwareProjects: [softwareProjectSchema],
  feedback: [feedbackSchema],
  // Secure files — never accessible via public URL
  files: [fileSchema],
  notes: { type: String, default: '' },
  linkedClientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // link to existing public Client record if any
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('CRMClient', crmClientSchema);
