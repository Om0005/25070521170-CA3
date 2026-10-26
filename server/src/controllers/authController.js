const User = require('../models/User');
const Student = require('../models/Student');
const signToken = require('../utils/token');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/error');

/** Normalises an email so the same address always maps to one account. */
const normaliseEmail = (value) => String(value || '').toLowerCase().trim();

/** Shared success payload for login / registration. */
const buildAuthResponse = async (user) => {
  let student = null;

  if (user.role === 'student' && user.student) {
    student = await Student.findById(user.student).lean();
  }

  return {
    token: signToken(user._id),
    user: user.toPublicJSON(),
    student,
  };
};

/** Validates the fields common to both signup forms. */
const validateCredentials = ({ name, email, password, confirmPassword }) => {
  const fields = {};

  if (!name || !String(name).trim()) fields.name = 'Name is required';
  if (!email || !String(email).trim()) fields.email = 'Email is required';
  if (!password) fields.password = 'Password is required';
  else if (String(password).length < 6) fields.password = 'Password must be at least 6 characters';
  if (confirmPassword !== undefined && password !== confirmPassword) {
    fields.confirmPassword = 'Passwords do not match';
  }

  return fields;
};

/**
 * POST /api/auth/register
 * Creates an administrator account and returns a token immediately.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const fields = validateCredentials({ name, email, password, confirmPassword });

  if (Object.keys(fields).length) {
    throw new ApiError(400, 'Please fix the highlighted fields', fields);
  }

  const exists = await User.findOne({ email: normaliseEmail(email) });
  if (exists) {
    throw new ApiError(409, 'An account with this email already exists', {
      email: 'This email is already registered',
    });
  }

  const user = await User.create({
    name: String(name).trim(),
    email: normaliseEmail(email),
    password,
    role: 'admin',
  });

  const payload = await buildAuthResponse(user);

  res.status(201).json({
    success: true,
    message: 'Administrator account created successfully',
    ...payload,
  });
});

/**
 * POST /api/auth/register/student
 * Public student self-registration. Creates the admission record and the
 * linked login account in one step, so a student can sign in immediately.
 */
const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, rollNo, phone, department, year, semester } =
    req.body;

  const fields = validateCredentials({ name, email, password, confirmPassword });

  if (!rollNo || !String(rollNo).trim()) fields.rollNo = 'Roll number is required';
  if (!department) fields.department = 'Department is required';
  if (!year) fields.year = 'Year is required';
  if (!semester) fields.semester = 'Semester is required';
  if (phone && !/^[0-9+\-\s]{8,15}$/.test(String(phone).trim())) {
    fields.phone = 'Enter a valid phone number';
  }

  if (Object.keys(fields).length) {
    throw new ApiError(400, 'Please fix the highlighted fields', fields);
  }

  const cleanEmail = normaliseEmail(email);
  const cleanRoll = String(rollNo).trim().toUpperCase();

  const [existingUser, existingRoll, existingStudentEmail] = await Promise.all([
    User.findOne({ email: cleanEmail }),
    Student.findOne({ rollNo: cleanRoll }),
    Student.findOne({ email: cleanEmail }),
  ]);

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists', {
      email: 'This email is already registered',
    });
  }

  if (existingRoll) {
    throw new ApiError(409, 'This roll number already has a student record', {
      rollNo: 'This roll number is already registered. Try signing in instead.',
    });
  }

  if (existingStudentEmail) {
    throw new ApiError(409, 'A student record with this email already exists', {
      email: 'This email is already linked to a student record',
    });
  }

  // Standalone MongoDB (the default local setup) has no transactions, so the
  // admission record is removed by hand if the login account cannot be created.
  const student = await Student.create({
    rollNo: cleanRoll,
    name: String(name).trim(),
    email: cleanEmail,
    phone: phone ? String(phone).trim() : '',
    department,
    year: Number(year),
    semester: Number(semester),
    status: 'active',
  });

  let user;
  try {
    user = await User.create({
      name: String(name).trim(),
      email: cleanEmail,
      password,
      role: 'student',
      student: student._id,
    });
  } catch (error) {
    await Student.deleteOne({ _id: student._id });
    throw error;
  }

  const payload = await buildAuthResponse(user);

  res.status(201).json({
    success: true,
    message: 'Student account created successfully',
    ...payload,
  });
});

/**
 * POST /api/auth/login
 * `portal` is optional, but when supplied ("admin" or "student") the account
 * role must match, which keeps the two sign-in doors genuinely separate.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password, portal } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required', {
      ...(email ? {} : { email: 'Email is required' }),
      ...(password ? {} : { password: 'Password is required' }),
    });
  }

  const user = await User.findOne({ email: normaliseEmail(email) }).select('+password');

  if (!user || !(await user.comparePassword(String(password)))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (portal && portal !== user.role) {
    const message =
      user.role === 'student'
        ? 'This is a student account. Please use the Student sign-in tab.'
        : 'This is an administrator account. Please use the Admin sign-in tab.';

    throw new ApiError(403, message, { portal: message });
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const payload = await buildAuthResponse(user);

  res.json({
    success: true,
    message: `Welcome back, ${user.name.split(' ')[0]}`,
    ...payload,
  });
});

/** GET /api/auth/me - hydrate the session (and the student profile). */
const getMe = asyncHandler(async (req, res) => {
  const payload = await buildAuthResponse(req.user);
  res.json({ success: true, user: payload.user, student: payload.student });
});

/** PUT /api/auth/me - update the account name / email. */
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'Account not found');

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  await user.save();

  // Keep the linked admission record in sync for student accounts.
  if (user.role === 'student' && user.student) {
    await Student.updateOne(
      { _id: user.student },
      { $set: { name: user.name, email: user.email } }
    );
  }

  const payload = await buildAuthResponse(user);
  res.json({ success: true, message: 'Profile updated', ...payload });
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

module.exports = { register, registerStudent, login, getMe, updateMe, changePassword };
