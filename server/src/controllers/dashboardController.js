const Student = require('../models/Student');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Notice = require('../models/Notice');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/dashboard
 * Everything the home screen needs, in a single request.
 */
const getDashboard = asyncHandler(async (req, res) => {
  const [students, courses, faculty, notices, recentStudents, recentNotices, byDepartment] =
    await Promise.all([
      Student.countDocuments({ status: 'active' }),
      Course.countDocuments({ isActive: true }),
      Faculty.countDocuments({ status: 'active' }),
      Notice.countDocuments({ published: true }),

      Student.find()
        .sort('-createdAt')
        .limit(5)
        .select('name rollNo department year status createdAt')
        .lean(),

      Notice.find({ published: true })
        .sort('-createdAt')
        .limit(4)
        .select('title priority audience createdAt')
        .lean(),

      Student.aggregate([
        { $group: { _id: '$department', students: { $sum: 1 } } },
        { $sort: { students: -1 } },
        { $project: { _id: 0, department: '$_id', students: 1 } },
      ]),
    ]);

  res.json({
    success: true,
    stats: { students, courses, faculty, notices },
    studentsByDepartment: byDepartment,
    recentStudents,
    recentNotices,
  });
});

module.exports = { getDashboard };
