const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Admin = require('../models/Admin');
const sendEmail = require('../utils/sendEmail');

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    const admin = await Admin.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change admin credentials
exports.changeCredentials = async (req, res) => {
  try {
    const { currentPassword, newPassword, username, email } = req.body;
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    if (username) admin.username = username;
    if (email) admin.email = email;
    if (newPassword) admin.password = newPassword; // will be hashed by pre-save

    await admin.save();
    res.json({ message: 'Credentials updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error updating credentials', error: error.message });
  }
};

// Verify token
exports.verify = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Forgot Password ────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    // Always return success to prevent email enumeration attacks
    if (!admin) {
      return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field (store it hashed)
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire (10 minutes)
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await admin.save();

    // Create reset url (points to the frontend)
    // Note: The frontend must know its own URL. We fallback to localhost if env isn't defined.
    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/admin/reset-password/${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password for your account.
      \n\n
      Please click on the following link to reset your password:\n\n
      ${resetUrl}
      \n\n
      If you did not request this, please ignore this email and your password will remain unchanged.
      This link is valid for 10 minutes.
    `;

    try {
      await sendEmail({
        email: admin.email,
        subject: 'Vantaigo Admin - Password Reset Request',
        message,
      });

      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;
      await admin.save();
      return res.status(500).json({ message: 'Email could not be sent', error: err.message });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Reset Password ─────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    // Re-hash the token from the URL to compare with DB
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password (handled by pre-save logic in model)
    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    
    await admin.save();

    res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
