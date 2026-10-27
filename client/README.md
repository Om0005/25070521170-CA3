# College Administration Portal — Frontend (React + Vite)

Glassmorphism UI for the CA3 Full Stack Web Development project.
**PRN: 25070521170**

This is the `client/` half of the project. The Express + MongoDB API lives in
the sibling [`../server`](../server) folder — **start the API first**, otherwise
the UI will show "Cannot reach the server".

---

## Quick start

```bash
# Terminal 1 — backend (see ../server/README.md)
cd server
npm install
npm start

# Terminal 2 — frontend
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

The Vite dev server proxies every `/api` request to
`http://localhost:5000`, so the browser never hits a CORS error. No `.env` file
is required for local development.

> First run? The API seeds the database automatically, so the dashboard is
> populated and both demo logins work immediately.

### Demo logins

| Portal | Login ID | Password |
| --- | --- | --- |
| Administrator | `omkashikar@college.edu` | `Admin@123` |
| Student | `aarav.mehta@student.edu` | `Student@123` |

---

## Routes

| Route | Portal | Description |
| --- | --- | --- |
| `/login` | Public | Administrator sign-in |
| `/register` | Public | Administrator account creation |
| `/student/login` | Public | Student sign-in |
| `/student/register` | Public | Student self-registration (creates admission record + login) |
| `/` | Admin | Dashboard: counters, department chart, latest notices |
| `/students` | Admin | Full CRUD for student records |
| `/courses` | Admin | Full CRUD for courses |
| `/faculty` | Admin | Full CRUD for faculty |
| `/notices` | Admin | Full CRUD + publish/unpublish for notices |
| `/student` | Student | Personal dashboard |
| `/student/courses` | Student | Courses for own department/semester |
| `/student/notices` | Student | Published notices |
| `/student/profile` | Student | Own profile — phone and address are editable |

Both portals are route-guarded by role: an administrator cannot open
`/student/*` and a student cannot open the admin pages.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 5173 (localhost only) |
| `npm run dev:host` | Dev server exposed on the LAN (open from another device) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the production build on port 4173 (proxies `/api`) |

---

## Environment variables (optional)

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | empty → `/api` | Set to a full API URL (e.g. `https://api.example.com/api`) when the frontend is deployed separately |
| `API_PROXY_TARGET` | `http://localhost:5000` | Where the dev/preview proxy forwards `/api` requests |

Create `client/.env` only when deploying. Local development works out of the
box.

---

## Folder structure

```
client/
├── src/
│   ├── api/           # axios instance, token storage, resource calls
│   ├── components/    # layout, shell, table, modal, toast, auth shell
│   ├── context/       # auth + toast providers
│   ├── pages/         # admin pages + student portal pages
│   ├── index.css      # glass design system
│   └── main.jsx       # entry point
├── .env.example
├── vite.config.js
└── package.json
```

**Data flow:** every screen reads from the live API — there is no mock data in
the frontend. Sessions are stored as a JWT in `localStorage`; a 401 response
clears the session and redirects to the correct sign-in page.

---

## Accessing from another laptop

```bash
npm run dev:host
```

Then open `http://<your-lan-ip>:5173` on the other device (allow port 5173
through the firewall). The API already trusts private LAN origins during
development.
