const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  designation: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  quote: {
    type: String,
    required: [true, 'Testimonial quote is required'],
  },
  avatar: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
