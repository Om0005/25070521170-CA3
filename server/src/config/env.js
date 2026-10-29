/**
 * Environment loader with safe defaults.
 *
 * The project is a college submission, so a fresh clone must run without any
 * manual setup. If `server/.env` is missing we fall back to sensible local
 * development values instead of crashing. A real .env always wins.
 */
const path = require('path');

// Load server/.env no matter which directory the process was started from.
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const DEFAULTS = {
  PORT: '5000',
  MONGO_URI: 'mongodb://127.0.0.1:27017/college_admin',
  JWT_SECRET: 'local-dev-secret-college-admin-25070521170',
  JWT_EXPIRES_IN: '7d',
  CLIENT_URL: 'http://localhost:5173,http://127.0.0.1:5173',
  NODE_ENV: 'development',
};

const applied = [];

Object.entries(DEFAULTS).forEach(([key, value]) => {
  if (!process.env[key] || !String(process.env[key]).trim()) {
    process.env[key] = value;
    applied.push(key);
  }
});

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && process.env.JWT_SECRET === DEFAULTS.JWT_SECRET) {
  throw new Error(
    'JWT_SECRET must be set to a private value when NODE_ENV=production.'
  );
}

if (applied.length && !isProduction) {
  console.log(
    `[env] No .env values for ${applied.join(', ')} - using built-in local defaults.`
  );
}

module.exports = {
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV,
  isProduction,
  usedDefaults: applied,
};
