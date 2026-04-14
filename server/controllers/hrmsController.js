const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const WorkItem = require('../models/WorkItem');

// ─── Employee Login ──────────────────────────────────────────────────────────
exports.employeeLogin = async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    if (!employeeId || !password)
      return res.status(400).json({ message: 'Employee ID and password are required' });

    const employee = await Employee.findOne({ employeeId: employeeId.toUpperCase() });
    if (!employee) return res.status(401).json({ message: 'Invalid credentials' });
    if (!employee.isActive) return res.status(403).json({ message: 'Account is deactivated' });

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: employee.employeeId, mongoId: employee._id, type: 'employee' },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({
      token,
      employee: {
        _id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        designation: employee.designation,
        avatar: employee.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Employee Password Management ────────────────────────────────────────────
exports.requestPasswordReset = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ message: 'Employee ID is required' });

    await Employee.findOneAndUpdate(
      { employeeId: employeeId.toUpperCase() },
      { passwordResetRequested: true }
    );
    
    // Generic response prevents username enumeration
    res.json({ message: 'If the ID exists, a password reset request has been sent to the Admin.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.changeOwnPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) 
      return res.status(400).json({ message: 'Current and new passwords are required' });
      
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const employee = await Employee.findById(req.employeeMongoId);
    
    const isMatch = await employee.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });
    
    employee.password = newPassword;
    await employee.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Employee CRUD (admin only) ──────────────────────────────────────────────
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password').sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    const result = employee.toObject();
    delete result.password;
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Error creating employee', error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const data = { ...req.body };
    // If password not being changed, remove it to avoid re-hashing
    if (!data.password) delete data.password;

    const employee = await Employee.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).select('-password');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: 'Error updating employee', error: error.message });
  }
};

exports.resetEmployeePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    let finalPassword = newPassword;
    
    // Auto-generate an 8-character random password if none provided
    if (!finalPassword) {
      finalPassword = Math.random().toString(36).slice(-8);
    }
    
    if (finalPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    employee.password = finalPassword;
    employee.passwordResetRequested = false; // Clear the flag
    await employee.save(); // triggers pre-save hash
    res.json({ message: 'Password reset successfully', newPassword: finalPassword });
  } catch (error) {
    res.status(400).json({ message: 'Error resetting password', error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    // Clean up related records
    await Attendance.deleteMany({ employee: req.params.id });
    await WorkItem.deleteMany({ employee: req.params.id });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Verify employee token ───────────────────────────────────────────────────
exports.verifyEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.employeeMongoId).select('-password');
    if (!employee || !employee.isActive) return res.status(401).json({ message: 'Unauthorized' });
    res.json({ employee });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Attendance ──────────────────────────────────────────────────────────────
exports.markAttendance = async (req, res) => {
  try {
    const { date, status, checkIn, checkOut, notes } = req.body;
    const employeeMongoId = req.employeeMongoId || req.body.employeeId;

    // Compute work hours if both times provided
    let workHours = 0;
    if (checkIn && checkOut) {
      workHours = parseFloat(((new Date(checkOut) - new Date(checkIn)) / 3600000).toFixed(2));
    }

    const record = await Attendance.findOneAndUpdate(
      { employee: employeeMongoId, date },
      { employee: employeeMongoId, date, status, checkIn, checkOut, notes, workHours },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: 'Error marking attendance', error: error.message });
  }
};

// Admin marks/edits attendance for any employee
exports.adminMarkAttendance = async (req, res) => {
  try {
    const { employeeMongoId, date, status, checkIn, checkOut, notes } = req.body;
    let workHours = 0;
    if (checkIn && checkOut) {
      workHours = parseFloat(((new Date(checkOut) - new Date(checkIn)) / 3600000).toFixed(2));
    }
    const record = await Attendance.findOneAndUpdate(
      { employee: employeeMongoId, date },
      { employee: employeeMongoId, date, status, checkIn, checkOut, notes, workHours },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(record);
  } catch (error) {
    res.status(400).json({ message: 'Error marking attendance', error: error.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { employee: req.employeeMongoId };
    if (month && year) {
      // Filter by YYYY-MM prefix
      filter.date = { $regex: `^${year}-${month.padStart(2, '0')}` };
    }
    const records = await Attendance.find(filter).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const { date, employeeId } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (employeeId) filter.employee = employeeId;

    const records = await Attendance.find(filter)
      .populate('employee', 'name employeeId department')
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Work Items ──────────────────────────────────────────────────────────────
exports.getMyWorkItems = async (req, res) => {
  try {
    const items = await WorkItem.find({ employee: req.employeeMongoId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllWorkItems = async (req, res) => {
  try {
    const { employeeId } = req.query;
    const filter = employeeId ? { employee: employeeId } : {};
    const items = await WorkItem.find(filter)
      .populate('employee', 'name employeeId')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createWorkItem = async (req, res) => {
  try {
    const employeeId = req.employeeMongoId || req.body.employee;
    const item = new WorkItem({ ...req.body, employee: employeeId });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Error creating work item', error: error.message });
  }
};

exports.updateWorkItem = async (req, res) => {
  try {
    const item = await WorkItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Work item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: 'Error updating work item', error: error.message });
  }
};

exports.deleteWorkItem = async (req, res) => {
  try {
    const item = await WorkItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Work item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
