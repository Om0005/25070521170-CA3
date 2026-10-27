const env = require('./config/env');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');
const { seedIfEmpty, demoCredentials } = require('./seed/seedData');

const app = express();

/* ------------------------------------------------------------------ */
/* CORS                                                                */
/* ------------------------------------------------------------------ */

// Origins listed in CLIENT_URL are always trusted (comma separated).
const allowedOrigins = (env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

// In development also accept localhost / 127.0.0.1 / private LAN addresses on
// any port, so the app can be opened from another laptop on the same Wi-Fi
// without editing any config.
const isLocalOrigin = (origin) => {
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== 'http:' && protocol !== 'https:') return false;
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    );
  } catch {
    return false;
  }
};

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      // No Origin header: curl, Postman, server-to-server calls.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (!env.isProduction && isLocalOrigin(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (!env.isProduction) {
  app.use(morgan('dev'));
}

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

// Friendly landing page so opening http://localhost:5000 in a browser explains
// what this server is instead of returning a bare 404.
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'College Administration Portal API',
    prn: '25070521170',
    health: '/health',
    api: '/api',
    docs: 'See server/README.md for the full endpoint list and setup steps.',
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

const start = async () => {
  try {
    await connectDB();

    // First run on a fresh database: fill it with demo data automatically so
    // the dashboard and both logins work immediately.
    await seedIfEmpty();

    const server = app.listen(env.PORT, () => {
      console.log('\n  College Administration Portal API');
      console.log(`  API       : http://localhost:${env.PORT}`);
      console.log(`  Health    : http://localhost:${env.PORT}/health`);
      console.log('  Frontend  : http://localhost:5173  (cd client && npm run dev)');
      console.log(`  Admin     : ${demoCredentials.admin.email} / ${demoCredentials.admin.password}`);
      console.log(`  Student   : ${demoCredentials.student.email} / ${demoCredentials.student.password}`);
      console.log(`  Environment: ${env.NODE_ENV}\n`);
    });

    // Graceful shutdown so nodemon restarts cleanly.
    const shutdown = (signal) => {
      console.log(`\n${signal} received, closing server...`);
      server.close(() => process.exit(0));
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('\n  Failed to start the server.');
    console.error(`  Reason: ${error.message}\n`);

    if (/ECONNREFUSED|Server selection timed out|ENOTFOUND/i.test(error.message)) {
      console.error('  MongoDB could not be reached.');
      console.error(`  Current MONGO_URI: ${env.MONGO_URI}`);
      console.error('  - Start MongoDB locally (Windows: Services -> MongoDB Server).');
      console.error('  - Or use a free MongoDB Atlas cluster and put its connection');
      console.error('    string in server/.env as MONGO_URI=...');
      console.error('  Nothing else needs to change.\n');
    } else {
      console.error('  Check server/.env (optional) and that MongoDB is running.\n');
    }

    process.exit(1);
  }
};

start();

module.exports = app;
