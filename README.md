# College Administration Portal

**CA3 — Full Stack Web Development**
**PRN: 25070521060**

A full-stack college administration portal built with **React (Vite)** on the client and **Node.js + Express + MongoDB** on the server. Administrators can sign in and manage students, courses, faculty members and campus notices from a single dashboard.

---

## Table of contents

1. [Project structure](#project-structure)
2. [Tech stack](#tech-stack)
3. [Features](#features)
4. [API reference](#api-reference)
5. [Getting started](#getting-started)
6. [Environment variables](#environment-variables)
7. [Demo account](#demo-account)
8. [Database seeding](#database-seeding)
9. [Switching to MongoDB Atlas](#switching-to-mongodb-atlas)
10. [Submission checklist](#submission-checklist)

---

## Project structure

```
25070521060/
├── client/                     # React application (Vite)
│   ├── src/
│   │   ├── api/                # axios instance + REST wrappers
│   │   ├── components/         # layout, modal, reusable CRUD screen
│   │   ├── context/            # auth + toast providers
│   │   ├── data/               # enums and formatting helpers
│   │   ├── pages/              # Login, Register, Dashboard, Students, Courses, Faculty, Notices
│   │   ├── App.jsx             # routing
│   │   ├── index.css           # design system
│   │   └── main.jsx
│   ├── .env.example
│   └── vite.config.js          # /api proxy -> localhost:5000
│
├── server/                     # Node.js + Express API
│   ├── src/
│   │   ├── config/db.js        # MongoDB connection
│   │   ├── controllers/        # auth, dashboard, CRUD factory, resources
│   │   ├── middleware/         # JWT guard, error handler
│   │   ├── models/             # User, Student, Course, Faculty, Notice
│   │   ├── routes/             # /api routes
│   │   ├── seed/seed.js        # demo data
│   │   ├── utils/              # constants, helpers, token
│   │   └── index.js            # app entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Tech stack

| Layer    | Technology                                                        |
| -------- | ----------------------------------------------------------------- |
| Frontend | React 18, React Router 6, Axios, Vite, hand-written CSS design system |
| Backend  | Node.js, Express 4, Mongoose 8, JWT, bcryptjs, CORS, Morgan       |
| Database | MongoDB (local via Compass, or MongoDB Atlas)                     |
| Tooling  | npm, nodemon, Git                                                 |

---

## Features

### Authentication

- Administrator **registration** and **login** with JWT (7-day expiry).
- Passwords hashed with **bcrypt** (salt rounds = 10) — never stored in plain text.
- Protected API routes: every request carries `Authorization: Bearer <token>`.
- Protected client routes: unauthenticated users are redirected to `/login`.
- Session stored in `localStorage`; expired/invalid tokens are cleared automatically.
- Logout clears the session.

### Dashboard (home page after login)

- Live counters: active students, running courses, faculty on roll, published notices.
- **Students by department** bar chart driven by a MongoDB aggregation.
- Latest published notices with priority indicators.
- Five most recent admissions.

### Students — full CRUD

- Fields: roll number, name, email, phone, department, year, status, admission date.
- Search by name / roll number / email / phone (debounced).
- Filters: department, year, status.
- Server-side pagination, unique roll number and email validation.

### Courses — full CRUD

- Fields: course code, title, department, credits, semester, seats, description, active flag.
- **Faculty assignment** via a Mongoose reference (populated in every response).
- Search + filters (department, semester, running/archived).

### Faculty — full CRUD

- Fields: employee ID, name, email, phone, department, designation, status.
- Search + filters (department, designation, status).

### Notices — full CRUD

- Fields: title, body, audience, priority, published flag, author.
- One-click **publish / unpublish** toggle directly in the table.
- Search + filters (audience, priority, published/draft).

### UI / UX

- Sidebar layout with an off-canvas drawer on mobile.
- Fully responsive: 4-column stats on desktop, 1-column on phones; tables scroll horizontally.
- Loading skeletons, empty states, inline field errors, confirmation dialogs and toast notifications.
- Accessible labels, focus rings and keyboard support (`Esc` closes modals).

---

## API reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint             | Access  | Description                     |
| ------ | -------------------- | ------- | ------------------------------- |
| POST   | `/auth/register`     | Public  | Create an administrator account |
| POST   | `/auth/login`        | Public  | Sign in, returns JWT            |
| GET    | `/auth/me`           | Private | Current user profile            |
| PUT    | `/auth/me`           | Private | Update name / email             |
| PUT    | `/auth/password`     | Private | Change password                 |

### Resources

`students`, `courses`, `faculty`, `notices` — all identical in shape:

| Method | Endpoint          | Access  | Description                                   |
| ------ | ----------------- | ------- | --------------------------------------------- |
| GET    | `/:resource`      | Private | List with `?page&limit&search&sort` + filters |
| GET    | `/:resource/:id`  | Private | Single record                                 |
| POST   | `/:resource`      | Private | Create record                                 |
| PUT    | `/:resource/:id`  | Private | Update record (`PATCH` also accepted)         |
| DELETE | `/:resource/:id`  | Private | Delete record                                 |

### Dashboard

| Method | Endpoint      | Access  | Description                          |
| ------ | ------------- | ------- | ------------------------------------ |
| GET    | `/dashboard`  | Private | Stats, department split, recent data |

### Example response

```json
{
  "success": true,
  "data": [],
  "total": 12,
  "page": 1,
  "pages": 2,
  "limit": 8
}
```

### Example errors

```json
{ "success": false, "message": "This roll number is already registered", "fields": { "rollNo": "This roll number is already in use" } }
{ "success": false, "message": "Please log in to continue", "fields": null }
```

---

## Getting started

### Prerequisites

- Node.js 18 or newer
- MongoDB running locally (MongoDB Compass / `mongod`) **or** a MongoDB Atlas connection string
- npm

### 1. Backend

```bash
cd server
npm install
copy .env.example .env      # Windows  (macOS/Linux: cp .env.example .env)
npm run seed                # optional: load demo data
npm run dev                 # http://localhost:5000
```

The server refuses to start if it cannot connect to MongoDB — this is intentional, so a broken database setup is obvious immediately.

### 2. Frontend

Open a **second terminal**:

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

Open <http://localhost:5173> and sign in.

> The Vite dev server proxies every `/api` request to `http://localhost:5000`, so no CORS configuration is needed during development.

### 3. Production build

```bash
cd client
npm run build               # output in client/dist
```

---

## Environment variables

`server/.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/college_admin
JWT_SECRET=super-secret-change-me-college-admin-2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

`client/.env` (optional — only needed when the API is on another host)

```env
VITE_API_URL=
```

`.env` files are intentionally excluded from Git. Copy from `.env.example` after cloning.

---

## Demo account

| Email               | Password    |
| ------------------- | ----------- |
| `admin@college.edu` | `Admin@123` |

Created by the seed script. You can also register a new administrator from `/register`.

---

## Database seeding

```bash
cd server
npm run seed              # adds data only if the collections are empty
npm run seed -- --fresh   # wipes students/courses/faculty/notices, then re-seeds
```

Seeded data:

| Collection | Records |
| ---------- | ------- |
| Users      | 1 administrator |
| Students   | 12 across 6 departments |
| Faculty    | 6 |
| Courses    | 8 (7 with assigned faculty) |
| Notices    | 4 (3 published, 1 draft) |

---

## Switching to MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Add a database user and allow network access from your IP (or `0.0.0.0/0` for a demo).
3. Copy the connection string and paste it into `server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/college_admin?retryWrites=true&w=majority
```

4. Restart the server and run `npm run seed`.

No code changes are required — the connection string is the only switch.

---

## Submission checklist

- [x] Root folder named with the PRN: `25070521060`
- [x] `client/` (React) and `server/` (Node.js) inside the root folder
- [x] `node_modules`, `.env` and `dist` excluded via `.gitignore`
- [x] Authentication (register + login) working
- [x] CRUD APIs for students, courses, faculty and notices
- [x] React pages connected to the API (not mock data)
- [x] Responsive, interactive UI
- [ ] Repository pushed to GitHub
- [ ] Repository link submitted in the Google form

### Git commands

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/<username>/25070521060-CA03.git
git push -u origin main
```

Verify the repository opens in an incognito window before submitting the link.

---

## Author

**PRN 25070521060** — CA3 submission, Full Stack Web Development.
