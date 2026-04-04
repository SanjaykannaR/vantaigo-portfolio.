const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
  },
  icon: {
    type: String,
    default: 'FiSettings',
  },
  category: {
    type: String,
    enum: ['hr', 'software'],
    required: true,
  },
  features: [{
    type: String,
  }],
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
