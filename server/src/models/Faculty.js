const mongoose = require('mongoose');
const { DEPARTMENTS, DESIGNATIONS, FACULTY_STATUS } = require('../utils/constants');

const facultySchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Faculty name is required'],
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
    designation: {
      type: String,
      enum: { values: DESIGNATIONS, message: 'Choose a valid designation' },
      required: [true, 'Designation is required'],
    },
    status: {
      type: String,
      enum: { values: FACULTY_STATUS, message: 'Choose a valid status' },
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faculty', facultySchema);
