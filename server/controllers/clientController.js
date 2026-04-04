const Client = require('../models/Client');

// Get all clients (public)
exports.getAll = async (req, res) => {
  try {
    const { serviceType, isFeatured } = req.query;
    const filter = {};
    if (serviceType) filter.serviceType = serviceType;
    if (isFeatured === 'true') filter.isFeatured = true;

    const clients = await Client.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single client
exports.getById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create client (admin)
exports.create = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error creating client', error: error.message });
  }
};

// Update client (admin)
exports.update = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error updating client', error: error.message });
  }
};

// Delete client (admin)
exports.delete = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
