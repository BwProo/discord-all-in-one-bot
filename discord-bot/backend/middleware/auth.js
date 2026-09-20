const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const checkGuildAdmin = async (req, res, next) => {
  const { guildId } = req.params;
  
  try {
    // In a real implementation, this would check if the user is an admin of the guild
    // For now, we'll assume access for demonstration purposes
    req.guildId = guildId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = {
  authenticateToken,
  checkGuildAdmin
};