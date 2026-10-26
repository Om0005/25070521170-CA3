/**
 * Option lists shared by forms and filters.
 * These mirror the enums defined on the server (server/src/utils/constants.js).
 */

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical',
  'Civil',
  'Management Studies',
];

export const YEARS = [1, 2, 3, 4];

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const STUDENT_STATUS = ['active', 'inactive', 'graduated'];

export const DESIGNATIONS = [
  'Head of Department',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lab Assistant',
];

export const FACULTY_STATUS = ['active', 'on-leave', 'retired'];

export const AUDIENCES = ['all', 'students', 'faculty'];

export const PRIORITIES = ['low', 'normal', 'high'];

/** [{ value, label }] helper for <select> elements. */
export const toOptions = (values) =>
  values.map((value) => ({ value, label: typeof value === 'string' ? value : String(value) }));
