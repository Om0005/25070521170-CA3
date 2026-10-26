/**
 * A small error class so controllers can throw `new ApiError(400, '...')`
 * and the central error handler knows which status code to send.
 */
class ApiError extends Error {
  constructor(status, message, fields = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
    Error.captureStackTrace(this, this.constructor);
  }
}

/** 404 for unknown routes. */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

/** Central error handler - every failure leaves the API in one consistent shape. */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';
  let fields = err.fields || null;

  // Mongoose schema validation
  if (err.name === 'ValidationError' && err.errors) {
    status = 400;
    message = 'Please check the highlighted fields';
    fields = Object.fromEntries(
      Object.entries(err.errors).map(([key, value]) => [key, value.message])
    );
  }

  // Duplicate key (unique index)
  if (err.code === 11000) {
    status = 409;

    const field = Object.keys(err.keyValue || err.keyPattern || {})[0] || 'field';
    const labels = {
      rollNo: 'roll number',
      employeeId: 'employee ID',
      email: 'email address',
      code: 'course code',
    };
    const label = labels[field] || field;

    message = `This ${label} is already registered`;
    fields = { [field]: `This ${label} is already in use` };
  }

  // Invalid ObjectId
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid record id';
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${status}] ${message}`);
  }

  res.status(status).json({ success: false, message, fields });
};

module.exports = { ApiError, notFound, errorHandler };
