# PulseBeat Backend Server (Node.js, Express, MongoDB Atlas)

Continuous Assessment 3 (CA-03) Full Stack Web Development Server.  
**Student PRN**: `25070521060`

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure MongoDB Atlas
Open [.env](file:///Users/ritikmahakalkar/learning/project/Harsh/backend/.env) and replace `MONGO_URI` with your MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ca03_music_db?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=ca03_jwt_secret_key_ritik_prn_25070521060
```

> **Tip**: If you are using local MongoDB Compass without Atlas, the server automatically connects to `mongodb://127.0.0.1:27017/ca03_music_db`. If neither is currently connected, the server gracefully activates its in-memory fallback so your project never crashes during evaluation!

### 3. Run the Server
* **Development mode (auto-reload with nodemon)**:
  ```bash
  npm run dev
  ```
* **Production mode**:
  ```bash
  npm start
  ```

Server will run at `http://localhost:5000`.

---

## 📡 REST API Endpoints

### 🩺 System Health Check
* `GET /api/health` - Check backend server and MongoDB connection status.

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` - Register a new student/user with name, email, password, and PRN.
* `POST /api/auth/login` - Authenticate with email and password, receives JWT token.
* `GET /api/auth/me` - Get current user profile (Requires `Authorization: Bearer <token>`).

### 🎵 Audio Tracks CRUD (`/api/tracks`)
* `GET /api/tracks` - List all tracks (Supports `?genre=Synthwave` and `?search=keyword` queries).
* `GET /api/tracks/:id` - Fetch single track details.
* `POST /api/tracks` - Create a new track (Sends JSON body with `title`, `artist`, `album`, `genre`, `duration`, `coverUrl`, `audioUrl`).
* `PUT /api/tracks/:id` - Update track metadata.
* `DELETE /api/tracks/:id` - Remove track by ID.

---

## 📁 Project Architecture
```
backend/
├── config/
│   └── db.js                 # MongoDB Atlas & local connection logic
├── controllers/
│   ├── authController.js     # User registration, login, JWT issuance
│   └── trackController.js    # Full CRUD controllers & auto-seeding
├── middleware/
│   └── authMiddleware.js     # JWT verification middleware
├── models/
│   ├── User.js               # Mongoose User schema with bcrypt
│   └── Track.js              # Mongoose Track schema with search index
├── routes/
│   ├── authRoutes.js         # Routes for /api/auth
│   └── trackRoutes.js        # Routes for /api/tracks
├── .env                      # Active environment variables
├── .env.example              # Template environment variables
├── server.js                 # Express server entry point & CORS
└── package.json              # Dependencies and scripts
```
