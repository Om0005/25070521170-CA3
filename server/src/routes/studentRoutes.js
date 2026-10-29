const express = require('express');
const { protect, requireRole } = require('../middleware/auth');
const {
  getDashboard,
  getCourses,
  getNotices,
  getProfile,
  updateProfile,
} = require('../controllers/studentPortalController');

const router = express.Router();

// The whole student portal is for student accounts only.
router.use(protect, requireRole('student'));

router.get('/dashboard', getDashboard);
router.get('/courses', getCourses);
router.get('/notices', getNotices);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
