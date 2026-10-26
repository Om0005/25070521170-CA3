const express = require('express');
const auth = require('./authRoutes');
const student = require('../controllers/studentController');
const course = require('../controllers/courseController');
const faculty = require('../controllers/facultyController');
const notice = require('../controllers/noticeController');
const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/** Small helper so each resource gets the same five REST endpoints. */
const resourceRoutes = (path, controller) => {
  const r = express.Router();

  r.route('/').get(controller.list).post(controller.create);
  r.route('/:id').get(controller.getOne).put(controller.update).patch(controller.update).delete(controller.remove);

  router.use(path, r);
};

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'College Administration Portal API',
    version: '1.0.0',
    endpoints: ['/api/auth', '/api/dashboard', '/api/students', '/api/courses', '/api/faculty', '/api/notices'],
  });
});

router.use('/auth', auth);

// Everything below requires a valid JWT.
router.use(protect);

router.get('/dashboard', getDashboard);
resourceRoutes('/students', student);
resourceRoutes('/courses', course);
resourceRoutes('/faculty', faculty);
resourceRoutes('/notices', notice);

module.exports = router;
