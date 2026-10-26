const Course = require('../models/Course');
const createCrudController = require('./crudFactory');
const { toNumber } = require('../utils/helpers');

/** Empty selects and text inputs arrive as "" - normalise before saving. */
const sanitize = (data) => {
  const clean = { ...data };

  if ('credits' in clean) clean.credits = toNumber(clean.credits);
  if ('semester' in clean) clean.semester = toNumber(clean.semester);
  if ('seats' in clean) clean.seats = toNumber(clean.seats);

  if ('faculty' in clean && (clean.faculty === '' || clean.faculty === 'null')) {
    clean.faculty = null;
  }

  if ('isActive' in clean) {
    clean.isActive = clean.isActive === true || clean.isActive === 'true' || clean.isActive === 'on';
  }

  return clean;
};

module.exports = createCrudController({
  model: Course,
  label: 'Course',
  fields: [
    'code',
    'title',
    'department',
    'credits',
    'semester',
    'seats',
    'faculty',
    'description',
    'isActive',
  ],
  searchFields: ['title', 'code', 'description'],
  filterFields: [
    { field: 'department' },
    { field: 'semester', type: 'number' },
    { field: 'isActive', type: 'boolean' },
  ],
  populate: { path: 'faculty', select: 'name designation department employeeId' },
  sanitize,
  defaultSort: 'code',
});
