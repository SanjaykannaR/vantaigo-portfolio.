const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: String, // stored as YYYY-MM-DD string for easy querying
    required: true,
  },
  checkIn: {
    type: Date,
    default: null,
  },
  checkOut: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'leave', 'holiday'],
    default: 'present',
  },
  workHours: {
    type: Number, // computed hours
    default: 0,
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Compound index: one attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
