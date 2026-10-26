const Student = require('../models/Student');
const User = require('../models/User');
const createCrudController = require('./crudFactory');

module.exports = createCrudController({
  model: Student,
  label: 'Student',
  fields: [
    'rollNo',
    'name',
    'email',
    'phone',
    'address',
    'department',
    'year',
    'semester',
    'status',
    'admissionDate',
  ],
  searchFields: ['name', 'rollNo', 'email', 'phone'],
  filterFields: [
    { field: 'department' },
    { field: 'year', type: 'number' },
    { field: 'semester', type: 'number' },
    { field: 'status' },
  ],
  defaultSort: '-createdAt',
  // Removing the admission record must also close the linked student login.
  afterRemove: async (doc) => {
    await User.deleteMany({ student: doc._id, role: 'student' });
  },
});
