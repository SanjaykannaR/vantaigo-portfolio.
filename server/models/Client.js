const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  logo: {
    type: String,
    default: '',
  },
  industry: {
    type: String,
    trim: true,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  serviceType: {
    type: String,
    enum: ['hr', 'software', 'both'],
    default: 'both',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  website: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
