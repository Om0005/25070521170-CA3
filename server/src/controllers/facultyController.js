const Faculty = require('../models/Faculty');
const createCrudController = require('./crudFactory');

module.exports = createCrudController({
  model: Faculty,
  label: 'Faculty member',
  fields: ['employeeId', 'name', 'email', 'phone', 'department', 'designation', 'status'],
  searchFields: ['name', 'employeeId', 'email'],
  filterFields: [
    { field: 'department' },
    { field: 'designation' },
    { field: 'status' },
  ],
  defaultSort: 'name',
});
