const mongoose = require('mongoose');

const workItemSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'pipeline', 'review', 'done'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  dueDate: {
    type: Date,
    default: null,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  // Admin can assign tasks to employees
  assignedBy: {
    type: String,
    enum: ['admin', 'self'],
    default: 'self',
  },
}, { timestamps: true });

module.exports = mongoose.model('WorkItem', workItemSchema);
