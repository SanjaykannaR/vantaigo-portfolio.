const SiteConfig = require('../models/SiteConfig');

// Public - get site config
exports.get = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = new SiteConfig();
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin - update site config
exports.update = async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = new SiteConfig(req.body);
    } else {
      Object.assign(config, req.body);
    }
    await config.save();
    res.json(config);
  } catch (error) {
    res.status(400).json({ message: 'Error updating site config', error: error.message });
  }
};
