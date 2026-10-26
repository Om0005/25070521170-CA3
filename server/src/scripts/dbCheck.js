/**
 * Prints the live MongoDB connection and a row count for every collection.
 *
 *   npm run db:check
 *
 * Handy during a demo/viva to prove the API is reading from a real database
 * and not from memory or mock data.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');

const COLLECTIONS = ['users', 'students', 'courses', 'faculties', 'notices'];

const run = async () => {
  const conn = await connectDB();
  const db = conn.connection.db;

  console.log(`\n  Database : ${db.databaseName}`);
  console.log(`  Host     : ${conn.connection.host}:${conn.connection.port}`);
  console.log(`  URI      : ${process.env.MONGO_URI}\n`);

  const existing = await db.listCollections().toArray();
  const names = existing.map((collection) => collection.name);

  if (names.length === 0) {
    console.log('  The database is empty. Run "npm run seed" to load demo data.\n');
  } else {
    for (const name of names.sort()) {
      const count = await db.collection(name).countDocuments();
      const note = COLLECTIONS.includes(name) ? '' : '  (not used by the app)';
      console.log(`  ${name.padEnd(14)} ${String(count).padStart(4)} documents${note}`);
    }
  }

  const latestStudent = await db.collection('students').findOne({});
  if (latestStudent) {
    console.log(`\n  Sample   : ${latestStudent.rollNo} — ${latestStudent.name} (${latestStudent.department})`);
  }

  console.log('');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (error) => {
  console.error(`\n  Could not connect: ${error.message}\n`);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
