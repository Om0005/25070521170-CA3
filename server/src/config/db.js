const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 *
 * The server is deliberately NOT started unless this succeeds - the API is
 * useless without a database, so we fail fast instead of pretending to be up.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is missing. Copy .env.example to .env and set it.');
  }

  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected -> ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

module.exports = connectDB;
