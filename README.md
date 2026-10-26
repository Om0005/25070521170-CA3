# College Administration Portal

**CA3 - Full Stack Web Development**
**PRN: 25070521170**

**Repository:** <https://github.com/Om0005/25070521170-CA3>

A complete full-stack college administration portal with **two separate experiences**:

- an **Administrator portal** for managing students, courses, faculty and campus notices;
- a **Student portal** where students create their own login, view their courses, read notices and keep their contact details up to date.

The client is built with **React (Vite)**, the API with **Node.js + Express**, and all data is stored in **MongoDB** -- there is no mock data anywhere in the UI.

---

## Table of contents

1. [Highlights](#highlights)
2. [Project structure](#project-structure)
3. [Tech stack](#tech-stack)
4. [Feature tour](#feature-tour)
5. [API reference](#api-reference)
6. [Getting started](#getting-started)
7. [Environment variables](#environment-variables)
8. [Demo accounts](#demo-accounts)
9. [Database seeding](#database-seeding)
10. [Switching to MongoDB Atlas](#switching-to-mongodb-atlas)
11. [Submission checklist](#submission-checklist)

---

## Highlights

- **Two sign-in doors** -- `/login` for administrators and `/student/login` for students. The API is role-aware: signing in through the wrong door returns **403** with a clear message and a one-click link to the correct door.
- **Student self-registration** -- students create their login with their roll number. The server creates the admission record and the linked login account together, then signs the student in automatically.
- **Role-based security** -- JWT authentication plus a `requireRole` guard. Students cannot call admin endpoints and administrators cannot call student endpoints.
- **Full admin CRUD** -- students, courses, faculty and notices, each with search, filters, server-side pagination and validation.
- **Live student portal** -- dashboard with a semester progress ring, credit totals, assigned courses, notices and profile completeness.
- **Glassmorphism UI** -- aurora backdrop, frosted panels, animated stat cards, sliding role switch, responsive sidebar, toasts and skeleton loaders.
- **MongoDB backed** -- every table, card and counter is served from the API and visible in MongoDB Compass.

---

## Project structure

```
25070521170/
├── client/                          # React application (Vite)
│   ├── src/
│   │   ├── api/                     # axios instance + REST wrappers
│   │   ├── components/              # layout, auth shell, role switch, reusable CRUD screen
│   │   ├── context/                 # auth + toast providers
│   │   ├── data/                    # enums and formatting helpers
│   │   ├── pages/
│   │   │   ├── Login.jsx            # admin sign-in door
│   │   │   ├── Register.jsx         # admin + student registration
│   │   │   ├── Dashboard.jsx        # admin dashboard
│   │   │   ├── Students.jsx         # admin CRUD pages
│   │   │   ├── Courses.jsx
│   │   │   ├── Faculty.jsx
│   │   │   ├── Notices.jsx
│   │   │   └── student/
│   │   │       ├── StudentDashboard.jsx
│   │   │       ├── StudentCourses.jsx
│   │   │       ├── StudentNotices.jsx
│   │   │       └── StudentProfile.jsx
│   │   ├── App.jsx                  # admin + student routes and role gates
│   │   ├── index.css                # glass design system
│   │   └── main.jsx
│   ├── .env.example
│   └── vite.config.js               # /api proxy -> localhost:5000
│
├── server/                          # Node.js + Express API
│   ├── src/
│   │   ├── config/db.js             # MongoDB connection
│   │   ├── controllers/             # auth, admin CRUD, student portal, dashboard
│   │   ├── middleware/              # JWT guard, role guard, error handler
│   │   ├── models/                  # User, Student, Course, Faculty, Notice
│   │   ├── routes/                  # /api routes
│   │   ├── scripts/dbCheck.js       # connection + collection report
│   │   ├── seed/seed.js             # demo data + demo logins
│   │   ├── utils/                   # constants, helpers, token
│   │   └── index.js                 # app entry point
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Tech stack

| Layer    | Technology                                                           |
| -------- | -------------------------------------------------------------------- |
| Frontend | React 18, React Router 6, Axios, Vite, hand-written CSS design system |
| Backend  | Node.js, Express 4, Mongoose 8, JWT, bcryptjs, CORS, Morgan          |
| Database | MongoDB (local via Compass, or MongoDB Atlas)                        |
| Tooling  | npm, nodemon, Git                                                    |

---

## Feature tour

### Administrator portal

| Route       | Description                                                                 |
| ----------- | --------------------------------------------------------------------------- |
| `/login`    | Administrator sign-in door with demo credentials and student-door switch     |
| `/register` | Create a new administrator account                                          |
| `/`         | Dashboard: live counters, students-by-department chart, latest notices, recent admissions |
| `/students` | Student CRUD with search, department/year/status filters and pagination      |
| `/courses`  | Course CRUD with faculty assignment, credits, semester and seats             |
| `/faculty`  | Faculty CRUD with department and designation filters                         |
| `/notices`  | Notice CRUD with publish/unpublish, audience and priority filters            |

Administrators can create, edit and delete every record. The sidebar, topbar and all tables use the indigo/violet theme.

### Student portal

| Route               | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `/student/login`    | Dedicated student sign-in door with demo credentials and admin-door switch    |
| `/student/register` | Self-registration: name, roll number, phone, email, department, year, semester and password |
| `/student`          | Dashboard: welcome hero, semester progress ring, course/credit/notice/faculty stats, assigned courses, latest notices and department contact |
| `/student/courses`  | Read-only catalogue of the student's department + semester courses           |
| `/student/notices`  | Published notices for students/all with priority filter and free-text search |
| `/student/profile`  | Admission details, account info, contact editing and password change         |

Students use a teal/emerald theme. Their identity fields (roll number, department, year, semester) remain administrator-controlled; students may edit only their **phone**, **address** and **password**.

### Authentication and roles

- Passwords are hashed with **bcrypt** (salt rounds = 10) and never stored in plain text.
- Successful login returns a **JWT** valid for 7 days; every protected request sends `Authorization: Bearer <token>`.
- The login endpoint accepts an optional `portal` value (`admin` or `student`). A mismatch is rejected with **403** and a message telling the user which door to use.
- Expired or invalid tokens are cleared automatically and the user is redirected to the correct sign-in page.
- Client routes are guarded with `ProtectedRoute`; each role is redirected to its own home.
- Deleting a student from the admin portal also removes the linked login account.

### UI / UX

- Animated aurora backdrop and frosted glass panels.
- Sliding Administrator/Student switch on both auth screens.
- Count-up statistics, staggered card entrances and hover lift effects.
- Responsive layout: sidebar becomes an off-canvas drawer; tables scroll horizontally; grids collapse to one column.
- Loading skeletons, inline field errors, empty states, confirmation dialogs and toast notifications.
- Accessible labels, focus rings and keyboard support (`Esc` closes modals).

---

## API reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint                  | Access  | Description                                              |
| ------ | ------------------------- | ------- | -------------------------------------------------------- |
| POST   | `/auth/register`          | Public  | Create an administrator account                           |
| POST   | `/auth/register/student`  | Public  | Create a student admission record + linked login          |
| POST   | `/auth/login`             | Public  | Sign in; accepts `portal` and returns JWT + user profile  |
| GET    | `/auth/me`                | Private | Current user (and linked student record when applicable)  |
| PUT    | `/auth/me`                | Private | Update name / email                                       |
| PUT    | `/auth/password`          | Private | Change password                                           |

Example login request:

```json
{
  "email": "aarav.mehta@student.edu",
  "password": "Student@123",
  "portal": "student"
}
```

Example student registration request:

```json
{
  "name": "Aarav Mehta",
  "rollNo": "25070521001",
  "email": "aarav.mehta@student.edu",
  "phone": "9822011201",
  "department": "Computer Science",
  "year": 3,
  "semester": 5,
  "password": "Student@123",
  "confirmPassword": "Student@123"
}
```

### Administrator resources

`students`, `courses`, `faculty`, `notices` -- all identical in shape and **admin-only**:

| Method | Endpoint         | Access | Description                                            |
| ------ | ---------------- | ------ | ------------------------------------------------------ |
| GET    | `/:resource`     | Admin  | List with `?page&limit&search&sort` plus resource filters |
| GET    | `/:resource/:id` | Admin  | Single record                                          |
| POST   | `/:resource`     | Admin  | Create record                                          |
| PUT    | `/:resource/:id` | Admin  | Update record (`PATCH` also accepted)                  |
| DELETE | `/:resource/:id` | Admin  | Delete record (cascades to a linked student login)     |

### Student portal

All routes below require a **student** token:

| Method | Endpoint           | Description                                                        |
| ------ | ------------------ | ------------------------------------------------------------------ |
| GET    | `/student/dashboard` | Profile, stats, department/semester courses, latest notices      |
| GET    | `/student/courses`   | Course catalogue for the student's department + semester         |
| GET    | `/student/notices`   | Published notices for students/all, optional `?priority=high`    |
| GET    | `/student/profile`   | Admission record plus account information                        |
| PUT    | `/student/profile`   | Update own phone and address                                     |

### Dashboard and health

| Method | Endpoint      | Access | Description                                    |
| ------ | ------------- | ------ | ---------------------------------------------- |
| GET    | `/dashboard`  | Admin  | Counters, department split, latest notices     |
| GET    | `/health`     | Public | Server and database status                     |

### Example list response

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
{ "success": false, "message": "This is a student account. Please use the Student sign-in tab.", "fields": { "portal": "This is a student account. Please use the Student sign-in tab." } }
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
npm run seed                # optional: load demo data and demo logins
npm run dev                 # http://localhost:5000
```

The server refuses to start if it cannot connect to MongoDB -- this is intentional, so a broken database setup is obvious immediately.

### 2. Frontend

Open a **second terminal**:

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

Open <http://localhost:5173>. You will land on the **Administrator sign-in** door; the **Student** tab switches to the student door.

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

`client/.env` (optional -- only needed when the API is on another host)

```env
VITE_API_URL=
```

`.env` files are intentionally excluded from Git. Copy from `.env.example` after cloning.

---

## Demo accounts

| Portal        | Email                      | Password      | Extra                    |
| ------------- | -------------------------- | ------------- | ------------------------ |
| Administrator | `omkashikar@college.edu`   | `Admin@123`   | Full CRUD access         |
| Student       | `aarav.mehta@student.edu`  | `Student@123` | Roll `25070521001`, Semester 5 |

Both accounts are created by the seed script. New students can also register themselves from `/student/register`, and new administrators from `/register`.

---

## Database seeding

```bash
cd server
npm run seed              # adds data only if the collections are empty
npm run seed -- --fresh   # wipes students/courses/faculty/notices/student logins, then re-seeds
```

Seeded data:

| Collection | Records                                                     |
| ---------- | ----------------------------------------------------------- |
| Users      | 1 administrator + 1 demo student login                      |
| Students   | 12 across 6 departments (semester backfilled from year)     |
| Faculty    | 6                                                           |
| Courses    | 8 (7 with an assigned faculty member)                       |
| Notices    | 4 (3 published, 1 draft)                                    |

The seed is idempotent: existing collections are skipped, the semester field is backfilled for older records, and the legacy `admin@college.edu` account is migrated to `omkashikar@college.edu`.

### Verifying the database connection

```bash
cd server
npm run db:check
```

Prints the live connection details and a document count for every collection -- useful for proving the API is reading from MongoDB rather than mock data.

### Viewing the data in MongoDB Compass

1. Open **MongoDB Compass**.
2. Connect with the string `mongodb://127.0.0.1:27017`.
3. Select the **`college_admin`** database -> `students`, `courses`, `faculties`, `notices`, `users`.

Any record you add, edit or delete in either portal appears there immediately.

---

## Switching to MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Add a database user and allow network access from your IP (or `0.0.0.0/0` for a demo).
3. Copy the connection string and paste it into `server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/college_admin?retryWrites=true&w=majority
```

4. Restart the server and run `npm run seed`.

No code changes are required -- the connection string is the only switch.

---

## Submission checklist

- [x] Root folder named with the PRN: `25070521170`
- [x] `client/` (React) and `server/` (Node.js) inside the root folder
- [x] `node_modules`, `.env` and `dist` excluded via `.gitignore`
- [x] Authentication with separate administrator and student doors
- [x] Student self-registration with roll number
- [x] CRUD APIs for students, courses, faculty and notices (admin-only)
- [x] Student portal backed by live API data (courses, notices, profile)
- [x] React pages connected to the API (no mock data)
- [x] Responsive, interactive UI with role-based theming
- [x] Repository pushed to GitHub
- [ ] Repository link submitted in the Google form

### Repository

<https://github.com/Om0005/25070521170-CA3>

Verify the repository opens in a fresh/incognito browser window before submitting the link.

---

## Author

**PRN 25070521170** -- CA3 submission, Full Stack Web Development.
