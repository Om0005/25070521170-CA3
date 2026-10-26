const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('./error');

/**
 * Verifies the "Authorization: Bearer <token>" header and attaches the
 * matching user document to req.user.
 */
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';

    if (!token) {
      throw new ApiError(401, 'Please log in to continue');
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, 'Your session has expired. Please log in again');
    }

    const user = await User.findById(payload.id);
    if (!user) {
      throw new ApiError(401, 'This account no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
