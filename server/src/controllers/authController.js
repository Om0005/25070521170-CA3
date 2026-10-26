const User = require('../models/User');
const signToken = require('../utils/token');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/error');

/**
 * POST /api/auth/register
 * Creates a portal account and returns a token immediately.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  const fields = {};
  if (!name || !String(name).trim()) fields.name = 'Name is required';
  if (!email || !String(email).trim()) fields.email = 'Email is required';
  if (!password) fields.password = 'Password is required';
  else if (String(password).length < 6) fields.password = 'Password must be at least 6 characters';
  if (confirmPassword !== undefined && password !== confirmPassword) {
    fields.confirmPassword = 'Passwords do not match';
  }

  if (Object.keys(fields).length) {
    throw new ApiError(400, 'Please fix the highlighted fields', fields);
  }

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) {
    throw new ApiError(409, 'An account with this email already exists', {
      email: 'This email is already registered',
    });
  }

  const user = await User.create({
    name: String(name).trim(),
    email: String(email).toLowerCase().trim(),
    password,
    role: role === 'staff' ? 'staff' : 'admin',
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: signToken(user._id),
    user: user.toPublicJSON(),
  });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required', {
      ...(email ? {} : { email: 'Email is required' }),
      ...(password ? {} : { password: 'Password is required' }),
    });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');

  if (!user || !(await user.comparePassword(String(password)))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: `Welcome back, ${user.name.split(' ')[0]}`,
    token: signToken(user._id),
    user: user.toPublicJSON(),
  });
});

/** GET /api/auth/me */
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toPublicJSON() });
});

/** PUT /api/auth/me - update name / email */
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'Account not found');

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  await user.save();

  res.json({ success: true, message: 'Profile updated', user: user.toPublicJSON() });
});

/** PUT /api/auth/password */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current and new password are required');
  }
  if (String(newPassword).length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters', {
      newPassword: 'Use at least 6 characters',
    });
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(String(currentPassword)))) {
    throw new ApiError(401, 'Current password is incorrect', {
      currentPassword: 'Incorrect password',
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = { register, login, getMe, updateMe, changePassword };
