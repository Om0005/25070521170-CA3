const Student = require('../models/Student');
const createCrudController = require('./crudFactory');

module.exports = createCrudController({
  model: Student,
  label: 'Student',
  fields: [
    'rollNo',
    'name',
    'email',
    'phone',
    'department',
    'year',
    'status',
    'admissionDate',
  ],
  searchFields: ['name', 'rollNo', 'email', 'phone'],
  filterFields: [
    { field: 'department' },
    { field: 'year', type: 'number' },
    { field: 'status' },
  ],
  defaultSort: '-createdAt',
});
