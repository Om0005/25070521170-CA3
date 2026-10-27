require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, isDbConnected } = require('./config/db');
const { autoSeedDatabase } = require('./controllers/trackController');

const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

connectDB().then((connected) => {
  if (connected) {
    autoSeedDatabase();
  }
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    server: 'PulseBeat Audio Engine active',
    database: isDbConnected() ? 'connected' : 'offline',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tracks', trackRoutes);

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 2rem; background: #0c0e17; color: #fff; min-height: 100vh;">
      <h1 style="color: #6366f1;">PulseBeat API Server</h1>
      <p>Status: <span style="color: #34d399;">Running</span></p>
      <p>Database: <strong>${isDbConnected() ? 'Connected' : 'Offline'}</strong></p>
      <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;" />
      <h3>Available Endpoints:</h3>
      <ul>
        <li><code>GET /api/health</code> - Health check</li>
        <li><code>POST /api/auth/register</code> - Register user</li>
        <li><code>POST /api/auth/login</code> - Login &amp; get JWT token</li>
        <li><code>GET /api/tracks</code> - List &amp; search tracks</li>
        <li><code>POST /api/tracks</code> - Create a track</li>
        <li><code>PUT /api/tracks/:id</code> - Update a track</li>
        <li><code>DELETE /api/tracks/:id</code> - Delete a track</li>
      </ul>
    </div>
  `);
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
