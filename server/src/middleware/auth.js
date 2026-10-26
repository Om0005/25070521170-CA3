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

/**
 * Route guard for a specific portal. The admin area and the student portal
 * share one API, so every protected route states who it is for.
 */
const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'You do not have permission to open this part of the portal')
      );
    }
    return next();
  };

module.exports = { protect, requireRole };
