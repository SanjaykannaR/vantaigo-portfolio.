const path = require('path');
const fs = require('fs');
const CRMClient = require('../models/CRMClient');

// ─── Get all CRM clients ─────────────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const clients = await CRMClient.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get single CRM client ───────────────────────────────────────────────────
exports.getOne = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Create CRM client ───────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const client = new CRMClient(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error creating client', error: error.message });
  }
};

// ─── Update CRM client ───────────────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const client = await CRMClient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error updating client', error: error.message });
  }
};

// ─── Delete CRM client ───────────────────────────────────────────────────────
exports.delete = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    // Delete all associated files
    for (const file of client.files) {
      // FUTURE CLOUD MIGRATION: replace with Cloudinary/S3 delete call
      const filePath = path.join(__dirname, '..', file.storedPath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await CRMClient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Upload secure file for a client ────────────────────────────────────────
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    // FUTURE CLOUD MIGRATION: storedPath will be cloud URL, storageType = 'cloudinary'
    const fileEntry = {
      originalName: req.file.originalname,
      storedName: req.file.filename,
      storedPath: `uploads/crm/${req.file.filename}`,
      storageType: 'local',
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      uploadedAt: new Date(),
    };

    client.files.push(fileEntry);
    await client.save();
    res.json({ message: 'File uploaded', file: fileEntry });
  } catch (error) {
    res.status(400).json({ message: 'Error uploading file', error: error.message });
  }
};

// ─── Download secure file (auth-gated, never public) ─────────────────────────
exports.downloadFile = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const file = client.files.id(req.params.fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // FUTURE CLOUD MIGRATION: redirect to signed Cloudinary/S3 URL instead
    const filePath = path.join(__dirname, '..', file.storedPath);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File missing on disk' });

    res.download(filePath, file.originalName);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Delete a file from a client ────────────────────────────────────────────
exports.deleteFile = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const file = client.files.id(req.params.fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    const filePath = path.join(__dirname, '..', file.storedPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    file.deleteOne();
    await client.save();
    res.json({ message: 'File deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Add feedback ────────────────────────────────────────────────────────────
exports.addFeedback = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    client.feedback.push(req.body);
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error adding feedback', error: error.message });
  }
};

// ─── Delete feedback ─────────────────────────────────────────────────────────
exports.deleteFeedback = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const fb = client.feedback.id(req.params.fbId);
    if (!fb) return res.status(404).json({ message: 'Feedback not found' });
    fb.deleteOne();
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Manage positions ────────────────────────────────────────────────────────
exports.addPosition = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    client.requestedPositions.push(req.body);
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error adding position', error: error.message });
  }
};

exports.updatePosition = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const pos = client.requestedPositions.id(req.params.posId);
    if (!pos) return res.status(404).json({ message: 'Position not found' });
    Object.assign(pos, req.body);
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error updating position', error: error.message });
  }
};

exports.deletePosition = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const pos = client.requestedPositions.id(req.params.posId);
    if (!pos) return res.status(404).json({ message: 'Position not found' });
    pos.deleteOne();
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Manage Software Projects ────────────────────────────────────────────────
exports.addSoftwareProject = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    client.softwareProjects.push(req.body);
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error adding software project', error: error.message });
  }
};

exports.updateSoftwareProject = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const proj = client.softwareProjects.id(req.params.projId);
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    Object.assign(proj, req.body);
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(400).json({ message: 'Error updating software project', error: error.message });
  }
};

exports.deleteSoftwareProject = async (req, res) => {
  try {
    const client = await CRMClient.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const proj = client.softwareProjects.id(req.params.projId);
    if (!proj) return res.status(404).json({ message: 'Project not found' });
    proj.deleteOne();
    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get CRM Overall Reports ─────────────────────────────────────────────────
exports.getReports = async (req, res) => {
  try {
    const clients = await CRMClient.find().lean();
    
    let hrRevenue = 0;
    let softwareRevenue = 0;
    let totalHrFinished = 0;
    let totalHrPending = 0;
    let totalSwFinished = 0;
    let totalSwPending = 0;
    let recentFeedback = [];

    clients.forEach(client => {
      // HR
      if (client.requestedPositions) {
        client.requestedPositions.forEach(pos => {
          hrRevenue += (pos.revenue || 0);
          if (pos.isPending) totalHrPending += pos.count;
          else totalHrFinished += pos.count;
        });
      }
      
      // Software
      if (client.softwareProjects) {
        client.softwareProjects.forEach(proj => {
          softwareRevenue += (proj.revenue || 0);
          if (proj.status === 'completed') totalSwFinished++;
          else totalSwPending++;
        });
      }

      // Feedback
      if (client.feedback) {
        client.feedback.forEach(fb => {
          recentFeedback.push({
            ...fb,
            clientName: client.companyName,
            clientId: client._id
          });
        });
      }
    });

    // Sort feedback descending by date, take top 10
    recentFeedback.sort((a, b) => new Date(b.date) - new Date(a.date));
    recentFeedback = recentFeedback.slice(0, 10);

    res.json({
      totalRevenue: hrRevenue + softwareRevenue,
      hrRevenue,
      softwareRevenue,
      totalHrFinished,
      totalHrPending,
      totalSwFinished,
      totalSwPending,
      recentFeedback
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
