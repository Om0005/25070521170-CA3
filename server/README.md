# College Administration Portal — Backend (Node + Express + MongoDB)

REST API for the CA3 Full Stack Web Development project.
**PRN: 25070521170**

This is the `server/` half of the project. The React frontend lives in the
sibling [`../client`](../client) folder.

---

## Quick start (fresh clone — 4 commands)

Requirements: **Node.js 18+** and **MongoDB** running locally
(or a free MongoDB Atlas cluster).

```bash
# Terminal 1 — backend
cd server
npm install
npm start
```

Then open a second terminal for the frontend:

```bash
# Terminal 2 — frontend
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

There is **nothing else to configure**. On the first start the API:

1. connects to `mongodb://127.0.0.1:27017/college_admin`,
2. detects that the database is empty and seeds demo data automatically,
3. prints the demo login credentials in the terminal.

A `.env` file is optional — built-in local defaults are used when it is
missing. Copy `.env.example` to `.env` only if you want to point the API at a
different database or port.

---

## Demo logins

| Portal | Login ID | Password |
| --- | --- | --- |
| Administrator | `omkashikar@college.edu` | `Admin@123` |
| Student | `aarav.mehta@student.edu` | `Student@123` |

Students can also create their own account from the student portal
(`/student/register`); new accounts are stored in MongoDB and can sign in
immediately.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Runs the API on port 5000 |
| `npm run dev` | Same, with nodemon auto-restart |
| `npm run seed` | Inserts demo data if collections are empty (safe to repeat) |
| `npm run seed:fresh` | Wipes students/courses/faculty/notices, then re-seeds |
| `npm run db:check` | Prints the live MongoDB connection and document counts |

---

## Environment variables

All optional. Defaults shown below.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `5000` | Port the API listens on |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/college_admin` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | built-in dev value | Secret used to sign auth tokens — set a private value in production |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `CLIENT_URL` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed CORS origins (comma separated) |
| `NODE_ENV` | `development` | `production` enables stricter checks |

To customise: `copy .env.example .env` (Windows) or `cp .env.example .env`
(macOS/Linux), then edit the values. `.env` is git-ignored on purpose.

**Using MongoDB Atlas instead of a local install:** put your cluster string in
`server/.env` and nothing else changes:

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/college_admin
```

---

## API reference

Base URL: `http://localhost:5000` — protected routes expect
`Authorization: Bearer <token>`.

### Health / meta

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | — | Uptime ping used to verify the API is live |
| GET | `/api` | — | Endpoint index |

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | — | Sign in. Optional `portal: "admin" \| "student"` enforces the correct portal (403 on mismatch) |
| POST | `/api/auth/register` | — | Create an administrator account |
| POST | `/api/auth/register/student` | — | Student self-registration (creates the admission record + login in one step) |
| GET | `/api/auth/me` | Any | Current user profile |
| PUT | `/api/auth/me` | Any | Update own name/email |
| PUT | `/api/auth/password` | Any | Change own password |

### Administrator portal (role: admin)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/dashboard` | Counters + department distribution + latest notices |
| GET / POST | `/api/students` | List / create students |
| GET / PUT / PATCH / DELETE | `/api/students/:id` | Read / update / delete one student |
| GET / POST | `/api/courses` | List / create courses |
| GET / PUT / PATCH / DELETE | `/api/courses/:id` | Read / update / delete one course |
| GET / POST | `/api/faculty` | List / create faculty |
| GET / PUT / PATCH / DELETE | `/api/faculty/:id` | Read / update / delete one faculty member |
| GET / POST | `/api/notices` | List / create notices |
| GET / PUT / PATCH / DELETE | `/api/notices/:id` | Read / update / delete one notice |

### Student portal (role: student)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/student/dashboard` | Own stats, current-semester courses, latest notices |
| GET | `/api/student/courses` | Courses for the student's department/semester |
| GET | `/api/student/notices` | Published notices for students |
| GET | `/api/student/profile` | Own admission record |
| PUT | `/api/student/profile` | Update own phone / address (nothing else) |

---

## Folder structure

```
server/
├── src/
│   ├── config/        # env defaults, MongoDB connection
│   ├── controllers/   # request handlers (admin + student portal)
│   ├── middleware/    # JWT auth, role guard, error handling
│   ├── models/        # Mongoose schemas: User, Student, Course, Faculty, Notice
│   ├── routes/        # /api route table with role gating
│   ├── scripts/       # db:check utility
│   ├── seed/          # demo data + auto-seed on first run
│   ├── utils/         # token helpers, async wrapper, constants
│   └── index.js       # Express app, CORS, boot sequence
├── .env.example
└── package.json
```

**Security model:** JWT bearer tokens; passwords hashed with bcrypt; every
admin route is behind `protect + requireRole('admin')`; the student router
applies `protect + requireRole('student')` to all of its routes; login rejects
a token request when the chosen portal does not match the account role.

---

## Troubleshooting

**`Failed to start the server — MongoDB could not be reached`**
MongoDB isn't running. Start it (Windows: `Services` → *MongoDB Server*), or
set `MONGO_URI` in `server/.env` to an Atlas connection string.

**`EADDRINUSE: address already in use :::5000`**
Another process is using port 5000. Either stop it or set `PORT=5001` in
`server/.env` and update the Vite proxy target
(`API_PROXY_TARGET=http://localhost:5001`).

**Frontend shows "Cannot reach the server"**
The API is not running, or it is on a different port than the Vite proxy
expects. Start `npm start` in `server/` first.

**`npm run db:check` says the database is empty**
Run `npm run seed` (or just restart the API — it seeds automatically).

---

## Accessing from another laptop

Same Wi-Fi, no deployment needed:

1. Start the API (`npm start`) and Vite with network access
   (`npm run dev:host` from `client/`).
2. Allow port 5173 through the firewall.
3. On the other machine open `http://<your-lan-ip>:5173`.

CORS already trusts localhost and private LAN addresses during development, so
no config change is required.
