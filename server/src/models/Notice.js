const mongoose = require('mongoose');
const { AUDIENCES, PRIORITIES } = require('../utils/constants');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
      maxlength: [140, 'Title cannot exceed 140 characters'],
    },
    body: {
      type: String,
      required: [true, 'Notice body is required'],
      trim: true,
      maxlength: [2000, 'Body cannot exceed 2000 characters'],
    },
    audience: {
      type: String,
      enum: { values: AUDIENCES, message: 'Choose a valid audience' },
      default: 'all',
    },
    priority: {
      type: String,
      enum: { values: PRIORITIES, message: 'Choose a valid priority' },
      default: 'normal',
    },
    published: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
