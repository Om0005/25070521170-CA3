const jwt = require('jsonwebtoken');
const { ApiError } = require('../middleware/error');

/** Creates a signed JWT for the given user id. */
const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'JWT_SECRET is not configured on the server');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = signToken;
