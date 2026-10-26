const mongoose = require('mongoose');
const { DEPARTMENTS, STUDENT_STATUS } = require('../utils/constants');

const studentSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      match: [/^$|^[0-9+\-\s]{8,15}$/, 'Enter a valid phone number'],
    },
    department: {
      type: String,
      enum: { values: DEPARTMENTS, message: 'Choose a valid department' },
      required: [true, 'Department is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1, 'Year must be between 1 and 4'],
      max: [4, 'Year must be between 1 and 4'],
    },
    status: {
      type: String,
      enum: { values: STUDENT_STATUS, message: 'Choose a valid status' },
      default: 'active',
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
