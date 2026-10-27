/**
 * Seeds the database with demo data so the portal is never empty on first run.
 *
 *   npm run seed            -> adds data only if a collection is empty
 *   npm run seed -- --fresh -> wipes students/courses/faculty/notices first
 *
 * The API also calls the same seeding function automatically when it starts
 * against an empty database, so this script is only needed for a reset.
 */
require('../config/env');

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { seedDatabase } = require('./seedData');

const run = async () => {
  const fresh = process.argv.includes('--fresh');

  await connectDB();
  await seedDatabase({ fresh });

  console.log('\nSeeding complete.\n');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (error) => {
  console.error('\nSeeding failed:', error.message);
  console.error('Check that MongoDB is running and MONGO_URI is correct.\n');
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
