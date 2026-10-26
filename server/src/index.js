require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------------------------------------------------------ */
/* Middleware                                                          */
/* ------------------------------------------------------------------ */

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
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

    const server = app.listen(PORT, () => {
      console.log(`\n  College Administration Portal API`);
      console.log(`  Running on http://localhost:${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}\n`);
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
    console.error('  Check that MongoDB is running and MONGO_URI in .env is correct.\n');
    process.exit(1);
  }
};

start();

module.exports = app;
