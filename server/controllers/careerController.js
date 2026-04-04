const Career = require('../models/Career');

exports.getAll = async (req, res) => {
  try {
    const { department, type, location } = req.query;
    const filter = { isActive: true };
    if (department) filter.department = department;
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };

    const careers = await Career.find(filter).sort({ postedAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: 'Job listing not found' });
    res.json(career);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const career = new Career(req.body);
    await career.save();
    res.status(201).json(career);
  } catch (error) {
    res.status(400).json({ message: 'Error creating job listing', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!career) return res.status(404).json({ message: 'Job listing not found' });
    res.json(career);
  } catch (error) {
    res.status(400).json({ message: 'Error updating job listing', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ message: 'Job listing not found' });
    res.json({ message: 'Job listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
