const Notice = require('../models/Notice');
const createCrudController = require('./crudFactory');

module.exports = createCrudController({
  model: Notice,
  label: 'Notice',
  fields: ['title', 'body', 'audience', 'priority', 'published'],
  searchFields: ['title', 'body'],
  filterFields: [
    { field: 'audience' },
    { field: 'priority' },
    { field: 'published', type: 'boolean' },
  ],
  populate: { path: 'postedBy', select: 'name email' },
  defaultSort: '-createdAt',
  sanitize: (data) => {
    const clean = { ...data };
    if ('published' in clean) {
      clean.published = clean.published === true || clean.published === 'true' || clean.published === 'on';
    }
    return clean;
  },
  beforeCreate: (payload, req) => {
    payload.postedBy = req.user._id;
  },
});
