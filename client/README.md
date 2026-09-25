# PlaceMate — Frontend (Phase 1: Setup + Auth)

React (Vite) frontend for PlaceMate. This phase covers project setup,
routing, login/register (role-aware), and protected/role-based dashboards.

## What's installed on your PC
You already have Node.js from the backend setup — nothing new to install.
This uses `npm` just like the server did.

## Setup

```bash
cd client
npm install
```

Copy `.env.example` to `.env`. The default (`http://localhost:5000/api`)
already matches your local backend, so you likely don't need to change it —
just make sure your backend server is running (`npm run dev` in the
`server` folder) at the same time.

Run the dev server:
```bash
npm run dev
```
Open the URL it prints (usually `http://localhost:5173`).

## What's built in this phase

- **Routing** (`react-router-dom`): Home, Login, Register, role-specific dashboards
- **Auth context** (`src/context/AuthContext.jsx`): holds the logged-in user,
  handles login/register/logout, persists session in `localStorage`
- **Axios client** (`src/api/axios.js`): automatically attaches your JWT to
  every API request once logged in
- **Protected routes**: `/student/dashboard`, `/recruiter/dashboard`,
  `/admin/dashboard` each redirect to `/login` if you're not authenticated,
  or `/unauthorized` if you're logged in as the wrong role
- **Register page**: role selector (student/recruiter/admin) that shows the
  right fields for each — branch/CGPA/skills for students, company info for
  recruiters. On recruiter registration, it redirects to login with a note
  that admin approval is required (since a pending recruiter can't actually
  use the app yet)
- **Dashboards**: currently placeholders — one page per role, ready to be
  filled with real data (job lists, applicant tables, analytics, etc.) in
  the next phases

## Folder structure

```
client/
├── src/
│   ├── api/
│   │   └── axios.js           # configured axios instance
│   ├── context/
│   │   └── AuthContext.jsx    # auth state + login/register/logout
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── NotFound.jsx
│   │   ├── Unauthorized.jsx
│   │   ├── student/StudentDashboard.jsx
│   │   ├── recruiter/RecruiterDashboard.jsx
│   │   └── admin/AdminDashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Try it out
1. Make sure the backend is running (`npm run dev` in `server`)
2. `npm run dev` here
3. Go to `/register`, create a student account → you land on the student dashboard
4. Log out, register a recruiter → you're sent to login with an approval notice
5. Approve that recruiter via Postman (`PUT /api/admin/recruiters/:id/approve`
   as an admin) then log in as the recruiter

## What's next (Frontend Phase 2)
Student dashboard: real profile view/edit, job browsing with eligibility
badges, apply flow, application tracking table. Let Claude know when you're
ready.

---

## Frontend Phase 2 — Student Dashboard

The student dashboard is now fully functional with three tabs:

- **Profile** — view/edit branch, CGPA, skills; upload/replace your resume
  (PDF) and see a link to the currently uploaded one
- **Jobs** — browse open jobs with search filters (company/branch/skill) and
  an "eligible only" toggle. Every job shows an Eligible/Not Eligible badge;
  ineligible jobs list exactly why (CGPA too low, wrong branch, missing
  skills) and their Apply button is disabled. Applying re-fetches the list
  so you immediately see it's no longer applicable if the job becomes
  full/closed
- **Applications** — a table of everything you've applied to, with
  color-coded status badges (Pending/Shortlisted/Selected/Rejected)

New files:
```
src/api/studentApi.js               # all student API calls in one place
src/components/student/
  ├── ProfileTab.jsx
  ├── JobsTab.jsx
  └── ApplicationsTab.jsx
```

`StudentDashboard.jsx` now just renders whichever tab is active — no new
routes needed, it's all client-side tab state.

## What's next (Frontend Phase 3)
Recruiter dashboard: post/edit/close jobs, view applicants per job with
resume links, update application status. Let Claude know when you're ready.
