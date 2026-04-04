const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
  },
  client: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  technologies: [{
    type: String,
    trim: true,
  }],
  category: {
    type: String,
    trim: true,
    default: 'Web App',
  },
  status: {
    type: String,
    enum: ['completed', 'ongoing'],
    default: 'completed',
  },
  completedDate: {
    type: Date,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
