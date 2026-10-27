# College Administration Portal

**CA3 — Full Stack Web Development · PRN: 25070521170**

A full-stack college management system with **two separate portals** — an
administrator workspace for managing students, courses, faculty and notices, and
a read-mostly student portal where students sign themselves up and view their own
academic data. Everything is stored in MongoDB and served through a REST API;
there is no mock data anywhere in the UI.

Built with **React + Vite** (frontend) and **Node.js + Express + MongoDB**
(backend), styled with a custom glassmorphism design system.

---

## Quick start

**Prerequisites:** [Node.js 18+](https://nodejs.org) and [MongoDB](https://www.mongodb.com/try/download/community)
running locally (or a free MongoDB Atlas cluster).

```bash
# Terminal 1 — backend
cd server
npm install
npm start
```

```bash
# Terminal 2 — frontend
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

That's it. No `.env` file is needed: the API uses built-in local defaults and,
on the very first start, automatically seeds the database with demo students,
courses, faculty, notices and both login accounts.

---

## Demo logins

| Portal | Login ID | Password |
| --- | --- | --- |
| Administrator | `omkashikar@college.edu` | `Admin@123` |
| Student | `aarav.mehta@student.edu` | `Student@123` |

Students can also create their own account from **`/student/register`** — this
creates the admission record and the login together, then signs them in.

---

## Features

### Administrator portal

- Dashboard with live counters, department-wise student distribution and the
  latest notices
- Full CRUD for **students**, **courses**, **faculty** and **notices**
- Search, filtering, pagination and sorting on every table
- Publish / unpublish notices with audience and priority levels
- Course-to-faculty assignment and semester/credit tracking

### Student portal

- Personal dashboard: current-semester courses, credits, notices and faculty
- Course list filtered by the student's department and semester
- Notice board with priority filters
- Own profile — contact details (phone, address) are editable; academic fields
  are read-only
- Self-registration with duplicate roll number / email protection

### Platform

- Role-aware authentication with JWT; login rejects the wrong portal with a
  clear message and a link to the correct sign-in page
- Passwords hashed with bcrypt
- Route guards on both portals — an admin cannot open student pages and vice versa
- Responsive glass UI with light/dark-friendly surfaces, animated counters and
  toast notifications
- Every screen reads from the live API, so changes appear immediately across
  both portals

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, React Router 6, Vite 5, Axios |
| Styling | Hand-written CSS design system (glassmorphism, CSS variables) |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose 8 |
| Auth | JSON Web Tokens + bcryptjs |

---

## Project structure

```
25070521170/
├── client/                 # React frontend (see client/README.md)
│   ├── src/
│   │   ├── api/            # axios instance, token storage, resource calls
│   │   ├── components/     # layout, shells, tables, modals, toasts
│   │   ├── context/        # auth + toast providers
│   │   ├── pages/          # admin pages and student portal pages
│   │   └── index.css       # glass design system
│   └── vite.config.js      # dev proxy: /api -> http://localhost:5000
│
└── server/                 # Express API (see server/README.md)
    ├── src/
    │   ├── config/         # env defaults, database connection
    │   ├── controllers/    # admin + student-portal handlers
    │   ├── middleware/     # JWT auth, role guards, error handling
    │   ├── models/         # User, Student, Course, Faculty, Notice
    │   ├── routes/         # /api route table with role gating
    │   ├── seed/           # demo data + auto-seed on first run
    │   └── index.js        # app bootstrap
    └── .env.example        # optional configuration reference
```

Detailed documentation lives in **[`client/README.md`](client/README.md)** and
**[`server/README.md`](server/README.md)** — the latter includes the complete
API reference.

---

## Routes

| Route | Portal | Purpose |
| --- | --- | --- |
| `/login` · `/register` | Public | Administrator sign-in / registration |
| `/student/login` · `/student/register` | Public | Student sign-in / self-registration |
| `/` · `/students` · `/courses` · `/faculty` · `/notices` | Admin | Management workspace |
| `/student` · `/student/courses` · `/student/notices` · `/student/profile` | Student | Student portal |

---

## Configuration (optional)

The API runs with these defaults; override them by copying
`server/.env.example` to `server/.env`:

| Variable | Default |
| --- | --- |
| `PORT` | `5000` |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/college_admin` |
| `JWT_SECRET` | built-in development value |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | `http://localhost:5173,http://127.0.0.1:5173` |

Useful commands in `server/`: `npm run seed` (seed if empty), `npm run seed:fresh`
(reset demo data), `npm run db:check` (print live collection counts).

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `MongoDB could not be reached` | Start the MongoDB service, or set `MONGO_URI` in `server/.env` to an Atlas string |
| `EADDRINUSE :::5000` | Free the port or set `PORT=5001` in `server/.env` and `API_PROXY_TARGET=http://localhost:5001` in `client/.env` |
| "Cannot reach the server" in the UI | Start the backend first (`cd server && npm start`) |
| Dashboard is empty | Restart the API — it seeds automatically — or run `npm run seed` |

---

## Accessing it from another device

On the same Wi-Fi: run `npm run dev:host` in `client/`, allow port 5173 through
the firewall, then open `http://<your-lan-ip>:5173`. CORS already trusts private
LAN origins during development.

---

**Author:** Om Kashikar · **PRN:** 25070521170
