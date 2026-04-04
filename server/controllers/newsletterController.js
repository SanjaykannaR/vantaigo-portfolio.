const Newsletter = require('../models/Newsletter');

// Public - subscribe
exports.subscribe = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        await existing.save();
        return res.json({ message: 'Welcome back! You have been re-subscribed.' });
      }
      return res.status(400).json({ message: 'Email is already subscribed' });
    }

    const subscriber = new Newsletter({ email, name });
    await subscriber.save();
    res.status(201).json({ message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin - get all subscribers
exports.getAll = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin - delete subscriber
exports.delete = async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    if (!subscriber) return res.status(404).json({ message: 'Subscriber not found' });
    res.json({ message: 'Subscriber removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin - export CSV
exports.exportCSV = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isActive: true }).sort({ subscribedAt: -1 });
    const csv = ['Name,Email,Subscribed Date'];
    subscribers.forEach(s => {
      csv.push(`"${s.name}","${s.email}","${s.subscribedAt.toISOString()}"`);
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=newsletter-subscribers.csv');
    res.send(csv.join('\n'));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
