const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../middleware/error');
const { pick, escapeRegex } = require('../utils/helpers');

/**
 * Builds the five standard CRUD handlers (list / getOne / create / update / remove)
 * for a model. Each resource only has to describe itself (fields, search, filters),
 * so every endpoint behaves the same way and stays easy to read.
 */
const createCrudController = ({
  model,
  label = 'Record',
  fields = [],
  searchFields = [],
  filterFields = [],
  populate = null,
  defaultSort = '-createdAt',
  sanitize = (data) => data,
  beforeCreate = null,
}) => {
  const populateQuery = (query) => (populate ? query.populate(populate) : query);

  /** GET /api/<resource> */
  const list = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const filter = {};

    filterFields.forEach(({ field, type = 'string' }) => {
      const raw = req.query[field];
      if (raw === undefined || raw === '' || raw === 'all') return;

      if (type === 'number') {
        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) filter[field] = parsed;
        return;
      }

      if (type === 'boolean') {
        filter[field] = raw === 'true' || raw === '1';
        return;
      }

      filter[field] = raw;
    });

    const search = String(req.query.search || '').trim();
    if (search && searchFields.length) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      filter.$or = searchFields.map((field) => ({ [field]: pattern }));
    }

    const sort =
      typeof req.query.sort === 'string' && req.query.sort.trim()
        ? req.query.sort.trim()
        : defaultSort;

    const [data, total] = await Promise.all([
      populateQuery(model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit)).exec(),
      model.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      limit,
    });
  });

  /** GET /api/<resource>/:id */
  const getOne = asyncHandler(async (req, res) => {
    const doc = await populateQuery(model.findById(req.params.id)).exec();
    if (!doc) throw new ApiError(404, `${label} not found`);
    res.json({ success: true, data: doc });
  });

  /** POST /api/<resource> */
  const create = asyncHandler(async (req, res) => {
    const payload = sanitize(pick(req.body, fields));
    if (beforeCreate) await beforeCreate(payload, req);

    const created = await model.create(payload);
    const doc = await populateQuery(model.findById(created._id)).exec();

    res.status(201).json({
      success: true,
      message: `${label} created successfully`,
      data: doc || created,
    });
  });

  /**
   * PUT / PATCH /api/<resource>/:id
   * Uses document.save() instead of an update query so every setter and
   * validator (uppercase codes, trim, enums, unique checks) runs.
   */
  const update = asyncHandler(async (req, res) => {
    const doc = await model.findById(req.params.id);
    if (!doc) throw new ApiError(404, `${label} not found`);

    const payload = sanitize(pick(req.body, fields));
    doc.set(payload);
    await doc.save();

    const updated = await populateQuery(model.findById(doc._id)).exec();

    res.json({
      success: true,
      message: `${label} updated successfully`,
      data: updated || doc,
    });
  });

  /** DELETE /api/<resource>/:id */
  const remove = asyncHandler(async (req, res) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, `${label} not found`);

    res.json({
      success: true,
      message: `${label} deleted successfully`,
      data: { id: doc._id },
    });
  });

  return { list, getOne, create, update, remove };
};

module.exports = createCrudController;
