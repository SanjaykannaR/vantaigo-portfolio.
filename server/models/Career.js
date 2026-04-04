const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  department: {
    type: String,
    default: 'General',
  },
  location: {
    type: String,
    default: 'Remote',
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time',
  },
  experience: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: [{
    type: String,
  }],
  responsibilities: [{
    type: String,
  }],
  salary: {
    type: String,
    default: '',
  },
  applyEmail: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('Career', careerSchema);
