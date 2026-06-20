const jwt = require('jsonwebtoken');
const pool = require('../db/db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const result = await pool.query(
      `
      SELECT *
      FROM users 
      WHERE id = $1
      `, 
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    if (user.status === 'blocked') {
      return res.status(401).json({
        message: 'User is blocked'
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
};

module.exports = authMiddleware;