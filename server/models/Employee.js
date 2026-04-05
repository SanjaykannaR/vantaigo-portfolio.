const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: '',
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  department: {
    type: String,
    trim: true,
    default: '',
  },
  designation: {
    type: String,
    trim: true,
    default: '',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Hash password before saving
employeeSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

employeeSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
