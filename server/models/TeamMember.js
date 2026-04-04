const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team member name is required'],
    trim: true,
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true,
  },
  department: {
    type: String,
    default: 'General',
  },
  bio: {
    type: String,
    default: '',
  },
  photo: {
    type: String,
    default: '',
  },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
