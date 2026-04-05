const jwt = require('jsonwebtoken');

/**
 * HRMS Employee auth middleware
 * Verifies an employee JWT token (issued by /api/hrms/employee-login)
 * Sets req.employeeId and req.employee on success
 */
const hrmsAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Employee tokens carry type: 'employee'
    if (decoded.type !== 'employee') {
      return res.status(401).json({ message: 'Invalid token type' });
    }
    req.employeeId = decoded.id;
    req.employeeMongoId = decoded.mongoId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = hrmsAuth;
