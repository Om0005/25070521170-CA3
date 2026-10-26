/**
 * Seeds the database with demo data so the portal is never empty on first run.
 *
 *   npm run seed           -> adds data only if a collection is empty
 *   npm run seed -- --fresh -> wipes students/courses/faculty/notices first
 */
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Notice = require('../models/Notice');

const ADMIN = {
  name: 'Dr. Anjali Deshmukh',
  email: 'admin@college.edu',
  password: 'Admin@123',
  role: 'admin',
};

const FACULTY = [
  {
    employeeId: 'FAC-101',
    name: 'Dr. Rajesh Kulkarni',
    email: 'rajesh.kulkarni@college.edu',
    phone: '9822011201',
    department: 'Computer Science',
    designation: 'Head of Department',
  },
  {
    employeeId: 'FAC-102',
    name: 'Prof. Sneha Iyer',
    email: 'sneha.iyer@college.edu',
    phone: '9822011202',
    department: 'Computer Science',
    designation: 'Associate Professor',
  },
  {
    employeeId: 'FAC-103',
    name: 'Prof. Amit Sharma',
    email: 'amit.sharma@college.edu',
    phone: '9822011203',
    department: 'Information Technology',
    designation: 'Assistant Professor',
  },
  {
    employeeId: 'FAC-104',
    name: 'Dr. Kavita Patil',
    email: 'kavita.patil@college.edu',
    phone: '9822011204',
    department: 'Electronics & Telecommunication',
    designation: 'Professor',
  },
  {
    employeeId: 'FAC-105',
    name: 'Prof. Nilesh Joshi',
    email: 'nilesh.joshi@college.edu',
    phone: '9822011205',
    department: 'Mechanical',
    designation: 'Assistant Professor',
  },
  {
    employeeId: 'FAC-106',
    name: 'Prof. Meera Nair',
    email: 'meera.nair@college.edu',
    phone: '9822011206',
    department: 'Management Studies',
    designation: 'Assistant Professor',
  },
];

const STUDENTS = [
  ['25070521001', 'Aarav Mehta', 'aarav.mehta@student.edu', 'Computer Science', 3, 'active'],
  ['25070521002', 'Isha Bhandari', 'isha.bhandari@student.edu', 'Computer Science', 2, 'active'],
  ['25070521003', 'Rohan Sawant', 'rohan.sawant@student.edu', 'Information Technology', 4, 'active'],
  ['25070521004', 'Priya Chavan', 'priya.chavan@student.edu', 'Information Technology', 1, 'active'],
  ['25070521005', 'Aditya Rao', 'aditya.rao@student.edu', 'Electronics & Telecommunication', 3, 'active'],
  ['25070521006', 'Sanya Kapoor', 'sanya.kapoor@student.edu', 'Computer Science', 4, 'active'],
  ['25070521007', 'Vikram Shinde', 'vikram.shinde@student.edu', 'Mechanical', 2, 'inactive'],
  ['25070521008', 'Neha Pawar', 'neha.pawar@student.edu', 'Management Studies', 1, 'active'],
  ['25070521009', 'Karan Bhatia', 'karan.bhatia@student.edu', 'Civil', 3, 'active'],
  ['25070521010', 'Tanvi Mehra', 'tanvi.mehra@student.edu', 'Information Technology', 2, 'active'],
  ['25070521011', 'Siddharth Nair', 'siddharth.nair@student.edu', 'Electronics & Telecommunication', 4, 'graduated'],
  ['25070521012', 'Ananya Kulkarni', 'ananya.kulkarni@student.edu', 'Computer Science', 1, 'active'],
];

const NOTICES = [
  {
    title: 'Semester end examination timetable released',
    body:
      'The tentative timetable for the end semester examinations is now available on the notice board. ' +
      'Students are advised to verify their registered subjects with their mentor before the last date.',
    audience: 'students',
    priority: 'high',
    published: true,
  },
  {
    title: 'Faculty development programme - registrations open',
    body:
      'A three day faculty development programme on outcome based education will be conducted next month. ' +
      'Interested faculty members may register with the academic office.',
    audience: 'faculty',
    priority: 'normal',
    published: true,
  },
  {
    title: 'Campus placement drive: Infosys and TCS',
    body:
      'Final year students from Computer Science and Information Technology are eligible for the upcoming ' +
      'placement drive. Carry three copies of your resume and a valid college ID.',
    audience: 'students',
    priority: 'high',
    published: true,
  },
  {
    title: 'Holiday notice - institute foundation day',
    body: 'The institute will remain closed on account of foundation day. All scheduled lectures stand cancelled.',
    audience: 'all',
    priority: 'low',
    published: false,
  },
];

const run = async () => {
  const fresh = process.argv.includes('--fresh');

  await connectDB();

  if (fresh) {
    await Promise.all([
      Student.deleteMany({}),
      Course.deleteMany({}),
      Faculty.deleteMany({}),
      Notice.deleteMany({}),
    ]);
    console.log('Cleared students, courses, faculty and notices.');
  }

  /* ---------------------------- admin ---------------------------- */
  let admin = await User.findOne({ email: ADMIN.email });
  if (!admin) {
    admin = await User.create(ADMIN);
    console.log(`Admin created -> ${ADMIN.email} / ${ADMIN.password}`);
  } else {
    console.log(`Admin already exists -> ${ADMIN.email}`);
  }

  /* --------------------------- faculty --------------------------- */
  let facultyDocs = await Faculty.find();
  if (facultyDocs.length === 0) {
    facultyDocs = await Faculty.insertMany(FACULTY);
    console.log(`Inserted ${facultyDocs.length} faculty members.`);
  } else {
    console.log(`Faculty already present (${facultyDocs.length}), skipping.`);
  }

  const facultyByName = Object.fromEntries(facultyDocs.map((f) => [f.name, f._id]));

  /* --------------------------- courses --------------------------- */
  const courseCount = await Course.countDocuments();
  if (courseCount === 0) {
    const courses = [
      {
        code: 'CS301',
        title: 'Full Stack Web Development',
        department: 'Computer Science',
        credits: 4,
        semester: 5,
        seats: 70,
        faculty: facultyByName['Prof. Sneha Iyer'] || null,
        description: 'React, Node.js, Express and MongoDB - building end to end web applications.',
      },
      {
        code: 'CS302',
        title: 'Database Management Systems',
        department: 'Computer Science',
        credits: 4,
        semester: 5,
        seats: 70,
        faculty: facultyByName['Dr. Rajesh Kulkarni'] || null,
        description: 'Relational modelling, normalisation, SQL and NoSQL fundamentals.',
      },
      {
        code: 'IT204',
        title: 'Operating Systems',
        department: 'Information Technology',
        credits: 3,
        semester: 4,
        seats: 60,
        faculty: facultyByName['Prof. Amit Sharma'] || null,
        description: 'Processes, scheduling, memory management and file systems.',
      },
      {
        code: 'IT401',
        title: 'Computer Networks',
        department: 'Information Technology',
        credits: 4,
        semester: 7,
        seats: 60,
        faculty: facultyByName['Prof. Amit Sharma'] || null,
        description: 'OSI and TCP/IP models, routing, and network security basics.',
      },
      {
        code: 'EC202',
        title: 'Digital Signal Processing',
        department: 'Electronics & Telecommunication',
        credits: 4,
        semester: 4,
        seats: 50,
        faculty: facultyByName['Dr. Kavita Patil'] || null,
        description: 'Sampling, transforms and filter design for digital signals.',
      },
      {
        code: 'ME101',
        title: 'Engineering Thermodynamics',
        department: 'Mechanical',
        credits: 3,
        semester: 1,
        seats: 65,
        faculty: facultyByName['Prof. Nilesh Joshi'] || null,
        description: 'Laws of thermodynamics, cycles and energy conversion.',
      },
      {
        code: 'MG501',
        title: 'Organisational Behaviour',
        department: 'Management Studies',
        credits: 3,
        semester: 5,
        seats: 80,
        faculty: facultyByName['Prof. Meera Nair'] || null,
        description: 'Individual and group behaviour in modern organisations.',
      },
      {
        code: 'CE303',
        title: 'Structural Analysis',
        department: 'Civil',
        credits: 4,
        semester: 5,
        seats: 55,
        faculty: null,
        description: 'Analysis of determinate and indeterminate structures.',
      },
    ];

    const inserted = await Course.insertMany(courses);
    console.log(`Inserted ${inserted.length} courses.`);
  } else {
    console.log(`Courses already present (${courseCount}), skipping.`);
  }

  /* --------------------------- students -------------------------- */
  const studentCount = await Student.countDocuments();
  if (studentCount === 0) {
    const students = STUDENTS.map(([rollNo, name, email, department, year, status]) => ({
      rollNo,
      name,
      email,
      phone: '',
      department,
      year,
      status,
    }));

    const inserted = await Student.insertMany(students);
    console.log(`Inserted ${inserted.length} students.`);
  } else {
    console.log(`Students already present (${studentCount}), skipping.`);
  }

  /* --------------------------- notices --------------------------- */
  const noticeCount = await Notice.countDocuments();
  if (noticeCount === 0) {
    const inserted = await Notice.insertMany(
      NOTICES.map((notice) => ({ ...notice, postedBy: admin._id }))
    );
    console.log(`Inserted ${inserted.length} notices.`);
  } else {
    console.log(`Notices already present (${noticeCount}), skipping.`);
  }

  console.log('\nSeeding complete.\n');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (error) => {
  console.error('Seeding failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
