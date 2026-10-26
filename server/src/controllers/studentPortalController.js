const Student = require('../models/Student');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Notice = require('../models/Notice');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/error');

/** Loads the admission record linked to the signed-in student account. */
const loadProfile = async (user) => {
  if (!user.student) {
    throw new ApiError(404, 'No student record is linked to this account yet');
  }

  const profile = await Student.findById(user.student).lean();
  if (!profile) {
    throw new ApiError(404, 'Your student record could not be found. Please contact the office.');
  }

  return profile;
};

/** Courses of the student's department + semester, with a department fallback. */
const coursesFor = async (profile) => {
  const populate = { path: 'faculty', select: 'name designation department' };

  const exact = await Course.find({
    department: profile.department,
    semester: profile.semester || 1,
    isActive: true,
  })
    .populate(populate)
    .sort('code')
    .lean();

  if (exact.length) return exact;

  return Course.find({ department: profile.department, isActive: true })
    .populate(populate)
    .sort('semester code')
    .lean();
};

const studentNoticeFilter = { published: true, audience: { $in: ['all', 'students'] } };

/**
 * GET /api/student/dashboard
 * Everything the student home screen needs: profile, courses, notices, stats.
 */
const getDashboard = asyncHandler(async (req, res) => {
  const profile = await loadProfile(req.user);

  const [courses, notices, noticeCount, facultyCount] = await Promise.all([
    coursesFor(profile),
    Notice.find(studentNoticeFilter)
      .sort('-createdAt')
      .limit(4)
      .select('title body priority audience createdAt')
      .lean(),
    Notice.countDocuments(studentNoticeFilter),
    Faculty.countDocuments({ department: profile.department, status: 'active' }),
  ]);

  const credits = courses.reduce((total, course) => total + (course.credits || 0), 0);

  res.json({
    success: true,
    profile,
    stats: {
      courses: courses.length,
      credits,
      notices: noticeCount,
      faculty: facultyCount,
    },
    courses,
    notices,
  });
});

/** GET /api/student/courses */
const getCourses = asyncHandler(async (req, res) => {
  const profile = await loadProfile(req.user);
  const courses = await coursesFor(profile);

  res.json({
    success: true,
    profile,
    courses,
    total: courses.length,
    credits: courses.reduce((total, course) => total + (course.credits || 0), 0),
  });
});

/** GET /api/student/notices */
const getNotices = asyncHandler(async (req, res) => {
  const profile = await loadProfile(req.user);

  const filter = { ...studentNoticeFilter };
  if (['low', 'normal', 'high'].includes(req.query.priority)) {
    filter.priority = req.query.priority;
  }

  const notices = await Notice.find(filter)
    .sort('-createdAt')
    .limit(60)
    .populate('postedBy', 'name role')
    .lean();

  res.json({ success: true, profile, data: notices, total: notices.length });
});

/** GET /api/student/profile */
const getProfile = asyncHandler(async (req, res) => {
  const profile = await loadProfile(req.user);

  res.json({
    success: true,
    profile,
    account: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      lastLoginAt: req.user.lastLoginAt,
      createdAt: req.user.createdAt,
    },
  });
});

/**
 * PUT /api/student/profile
 * Students may maintain their own contact details. Identity fields
 * (roll number, department, year, semester) stay under admin control.
 */
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await Student.findById(req.user.student);
  if (!profile) throw new ApiError(404, 'Your student record could not be found');

  if (req.body.phone !== undefined) {
    const phone = String(req.body.phone).trim();
    if (phone && !/^[0-9+\-\s]{8,15}$/.test(phone)) {
      throw new ApiError(400, 'Enter a valid phone number', {
        phone: 'Use 8–15 digits, spaces, + or -',
      });
    }
    profile.phone = phone;
  }

  if (req.body.address !== undefined) {
    profile.address = String(req.body.address).trim().slice(0, 200);
  }

  await profile.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    profile: profile.toObject(),
  });
});

module.exports = { getDashboard, getCourses, getNotices, getProfile, updateProfile };
