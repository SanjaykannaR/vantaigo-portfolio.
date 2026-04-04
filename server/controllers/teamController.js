const TeamMember = require('../models/TeamMember');

exports.getAll = async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: 'Error creating team member', error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: 'Error updating team member', error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found' });
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
