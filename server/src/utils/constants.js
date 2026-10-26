/**
 * Shared enums used by the Mongoose models.
 * Keeping them in one place means the schema and the API stay in sync.
 */

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical',
  'Civil',
  'Management Studies',
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const STUDENT_STATUS = ['active', 'inactive', 'graduated'];

const DESIGNATIONS = [
  'Head of Department',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lab Assistant',
];

const FACULTY_STATUS = ['active', 'on-leave', 'retired'];

const AUDIENCES = ['all', 'students', 'faculty'];

const PRIORITIES = ['low', 'normal', 'high'];

const ROLES = ['admin', 'staff'];

module.exports = {
  DEPARTMENTS,
  SEMESTERS,
  STUDENT_STATUS,
  DESIGNATIONS,
  FACULTY_STATUS,
  AUDIENCES,
  PRIORITIES,
  ROLES,
};
