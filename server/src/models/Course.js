const mongoose = require('mongoose');
const { DEPARTMENTS, SEMESTERS } = require('../utils/constants');

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    department: {
      type: String,
      enum: { values: DEPARTMENTS, message: 'Choose a valid department' },
      required: [true, 'Department is required'],
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: [1, 'Credits must be between 1 and 6'],
      max: [6, 'Credits must be between 1 and 6'],
    },
    semester: {
      type: Number,
      enum: { values: SEMESTERS, message: 'Choose a valid semester' },
      required: [true, 'Semester is required'],
    },
    seats: {
      type: Number,
      default: 60,
      min: [1, 'Seats must be at least 1'],
      max: [300, 'Seats cannot exceed 300'],
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
