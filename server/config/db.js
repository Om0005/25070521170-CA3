const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const atlasUri = process.env.MONGO_URI;
  const localUri = process.env.LOCAL_MONGO_URI || 'mongodb://127.0.0.1:27017/pulsebeat_db';

  if (atlasUri && !atlasUri.includes('<username>')) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(atlasUri, {
        dbName: 'pulsebeat_db',
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = true;
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return true;
    } catch (err) {
      console.warn(`MongoDB Atlas connection failed: ${err.message}`);
      console.log('Attempting local MongoDB fallback...');
    }
  }

  try {
    const conn = await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`Local MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn(`Local MongoDB connection failed: ${err.message}`);
    console.log('Running in in-memory fallback mode.');
    isConnected = false;
    return false;
  }
};

const isDbConnected = () => isConnected;

module.exports = { connectDB, isDbConnected };
