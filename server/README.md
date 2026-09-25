# PlaceMate — Phase 1 (Backend Foundation)

This is the auth + user foundation for PlaceMate. It covers registration, login,
JWT auth, role-based access, and the Student/Recruiter profile creation that
happens at signup.

## What's installed on your PC

Install these once, in order:

1. **Node.js (LTS)** — https://nodejs.org — this gives you `node` and `npm`.
   Verify with:
   ```
   node -v
   npm -v
   ```
2. **MongoDB** — pick ONE:
   - **Local:** Install MongoDB Community Server (https://www.mongodb.com/try/download/community)
     and MongoDB Compass (GUI, optional but helpful) to browse your data.
   - **Cloud (recommended, easier):** Create a free cluster on MongoDB Atlas
     (https://www.mongodb.com/cloud/atlas/register). No local install needed —
     you just get a connection string.
3. **VS Code** — https://code.visualstudio.com (or any code editor you like)
4. **Postman** (https://www.postman.com/downloads/) or the **Thunder Client**
   VS Code extension — for testing API endpoints without a frontend yet.
5. **Git** — https://git-scm.com — for version control (optional but recommended).

## Setup steps

```bash
cd server
npm install
```

Then:
1. Copy `.env.example` to `.env`
2. Fill in `MONGO_URI`:
   - Local Mongo: `mongodb://localhost:27017/placemate`
   - Atlas: paste the connection string Atlas gives you (replace `<password>`)
3. Set `JWT_SECRET` to any long random string (this signs your login tokens)

Run the server:
```bash
npm run dev
```
You should see:
```
MongoDB Connected: ...
Server running on port 5000
```

## Testing the API (Postman/Thunder Client)

### Register a student
`POST http://localhost:5000/api/auth/register`
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "9876543210",
  "password": "Passw0rd!",
  "role": "student",
  "branch": "CSE",
  "cgpa": 8.5,
  "skills": ["Java", "SQL"]
}
```

### Register a recruiter
`POST http://localhost:5000/api/auth/register`
```json
{
  "name": "Rahul Verma",
  "email": "rahul@abctech.com",
  "phone": "9123456780",
  "password": "Passw0rd!",
  "role": "recruiter",
  "companyName": "ABC Technologies",
  "companyDescription": "Software services company"
}
```
Note: recruiters get `isApproved: false` by default and **cannot log in**
until an admin approves them (that endpoint comes in Phase 4).

### Login
`POST http://localhost:5000/api/auth/login`
```json
{
  "email": "priya@example.com",
  "password": "Passw0rd!"
}
```
Response includes a `token` — copy it.

### Get current user (protected route)
`GET http://localhost:5000/api/auth/me`
Header: `Authorization: Bearer <paste token here>`

## Validation rules enforced

- Phone: exactly 10 digits
- Email: standard email format
- Password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
- Role: must be `student`, `recruiter`, or `admin`

## Folder structure

```
server/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── authController.js  # register/login/getMe logic
├── middleware/
│   ├── auth.js             # JWT verification + role guard
│   └── validate.js         # input validation
├── models/
│   ├── User.js
│   ├── StudentProfile.js
│   └── RecruiterProfile.js
├── routes/
│   └── authRoutes.js
├── .env.example
├── package.json
└── server.js
```

---

## Phase 2 — Student Module

Adds: profile view/update, job browsing (with search/filter + eligibility
check baked into every job), apply flow, and application tracking.

### New models
- `Job` — posted by a recruiter (postedBy), has minCGPA/branch/skills requirements
- `Application` — links a student to a job with a status; one application per
  student per job (enforced by a unique index)

### Seeding sample jobs (so you can test without waiting for Phase 3)
Since recruiters can't post jobs yet, run the seed script to insert 3 sample
jobs. You need at least one recruiter registered first (see Phase 1 section),
**and manually set that recruiter's `isApproved` to `true` in MongoDB** since
the approval endpoint doesn't exist until Phase 4.

```bash
node seed/seedJobs.js
```

### New endpoints (all require `Authorization: Bearer <token>` from a student login)

**GET `/api/student/profile`** — view your student profile

**PUT `/api/student/profile`** — update branch/cgpa/skills
```json
{ "cgpa": 8.7, "skills": ["Java", "SQL", "React"] }
```

**GET `/api/jobs`** — list open jobs. Each job in the response includes an
`eligibility` object showing whether you qualify and why/why not.
Query params (all optional): `company`, `branch`, `skill`, `eligibleOnly=true`

**POST `/api/jobs/:id/apply`** — apply to a job. Server re-checks eligibility
and rejects the request if you don't qualify or already applied.

**GET `/api/student/applications`** — your applications with current status
(`Pending` → `Shortlisted` → `Selected`/`Rejected`) and the job details.

### Eligibility logic
Lives in `utils/eligibility.js` (reused later by the recruiter side too):
- CGPA: student's CGPA >= job's minCGPA
- Branch: student's branch must be in the job's eligible branch list
- Skills: student must have **all** of the job's required skills

---

## Phase 3 — Recruiter Module

Adds: post/edit/delete jobs, view applicants per job (with their full
profile), and update application status. All routes require
`Authorization: Bearer <token>` from an **approved** recruiter login.

You can now skip `seed/seedJobs.js` if you'd rather post jobs for real
through these endpoints — the seed script still works if you want quick
test data.

### New endpoints

**POST `/api/recruiter/jobs`** — post a new job
```json
{
  "title": "Software Developer",
  "company": "ABC Technologies",
  "description": "Backend role, Java + SQL",
  "minCGPA": 7.5,
  "branch": ["CSE", "IT"],
  "skills": ["Java", "SQL"]
}
```

**GET `/api/recruiter/jobs`** — list jobs you've posted, each with a live
`applicationCount`

**PUT `/api/recruiter/jobs/:id`** — edit a job you own (send only the fields
you want to change, e.g. `{ "status": "closed" }` to stop accepting
applications)

**DELETE `/api/recruiter/jobs/:id`** — delete a job you own (also deletes its
applications)

**GET `/api/recruiter/jobs/:id/applications`** — view every applicant for one
of your jobs, including their name/email/phone and their branch/CGPA/skills

**PUT `/api/recruiter/applications/:id/status`** — update an applicant's
status
```json
{ "status": "Shortlisted" }
```
Valid values: `Pending`, `Shortlisted`, `Selected`, `Rejected`

### Ownership enforcement
Every job-scoped route checks that `job.postedBy` matches the logged-in
recruiter — one recruiter can never edit, delete, or view applicants for
another recruiter's job, even with a valid token.

---

## Phase 4 — Admin Module

Adds: manage students/recruiters, approve/reject pending recruiters,
activate/deactivate any account, monitor all jobs/applications, an analytics
summary, and CSV exports. All routes require `Authorization: Bearer <token>`
from an admin login.

### Getting an admin account
There's no separate "make me an admin" endpoint by design — register a user
via `/api/auth/register` with `"role": "admin"` like normal, then treat that
account as your admin login going forward. In a real deployment you'd lock
this down (e.g. only allow admin registration from a seeded account or a
protected internal route) — for a college project, registering one manually
and remembering the credentials is fine.

### New endpoints

**GET `/api/admin/students`** — all students with their profile (branch, CGPA, skills)

**GET `/api/admin/recruiters`** — all recruiters with their company profile and `isApproved` status

**PUT `/api/admin/recruiters/:id/approve`** — approve a pending recruiter so they can log in and post jobs

**DELETE `/api/admin/recruiters/:id`** — reject/remove a recruiter entirely (also deletes their jobs)

**PUT `/api/admin/users/:id/status`** — activate or deactivate any student/recruiter account
```json
{ "isActive": false }
```
A deactivated account is blocked at login.

**GET `/api/admin/jobs`** — every job on the platform, with who posted it

**DELETE `/api/admin/jobs/:id`** — remove any job (e.g. inappropriate posting)

**GET `/api/admin/applications`** — every application across the platform

**GET `/api/admin/analytics`** — summary stats:
```json
{
  "totalStudents": 40,
  "totalRecruiters": 5,
  "pendingRecruiters": 1,
  "totalJobs": 8,
  "openJobs": 6,
  "totalApplications": 52,
  "placedCount": 12,
  "placementPercent": "30.00%",
  "branchWise": [{ "branch": "CSE", "totalStudents": 20, "placed": 8 }],
  "companyWise": [{ "company": "ABC Technologies", "hired": 5 }]
}
```

**GET `/api/admin/export/placed-students`** — downloads a CSV of every
`Selected` student with their contact info, branch, CGPA, and which
company/role they were placed in

**GET `/api/admin/export/company-report`** — downloads a CSV of hire counts
per company

---

## Phase 5 — Resume Upload, Email Notifications & Deployment

### Resume upload (Cloudinary)
1. Create a free account at cloudinary.com
2. From your Cloudinary dashboard, copy `Cloud Name`, `API Key`, `API Secret`
   into `.env` (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)

**POST `/api/student/resume`** — upload/replace your resume (student login required)
- Send as `multipart/form-data`, field name **`resume`**, PDF only, max 5MB
- In Postman: Body → form-data → key `resume`, type File → pick a PDF
- Response gives you the hosted `resumeUrl`, which is now also included when
  a recruiter views applicants (`GET /api/recruiter/jobs/:id/applications`)
  via the student's profile

### Email notifications (Nodemailer)
Using Gmail as the example provider:
1. Turn on 2-Step Verification on the Gmail account you'll send from
2. Generate an **App Password**: Google Account → Security → App Passwords
3. In `.env`, set:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=youraddress@gmail.com
   EMAIL_PASS=<the 16-character app password, not your real Gmail password>
   ```

Emails are sent automatically:
- To a recruiter when an admin approves their account
- To a student when a recruiter updates their application status

If `EMAIL_USER`/`EMAIL_PASS` aren't set, emails are skipped silently (logged
to the console instead) — so the app still works fully without email
configured, useful while you're still developing.

### Deployment

**Backend — Render (free tier) is the simplest option:**
1. Push this `server` folder to a GitHub repo
2. On render.com → New → Web Service → connect your repo
3. Build command: `npm install` — Start command: `npm start`
4. Add all your `.env` variables under Render's Environment tab (same
   keys/values as your local `.env`, but `MONGO_URI` should point to your
   same Atlas cluster — Atlas already works from anywhere since you allowed
   all IPs)
5. Deploy — Render gives you a live URL like `https://placemate-api.onrender.com`

**Database:** Already on Atlas — nothing more to do, same cluster works in production.

**Frontend (once built):** Deploy to Vercel or Netlify, and set `CLIENT_URL`
in the backend's `.env` to that deployed frontend URL (used for CORS once
you lock CORS down to a specific origin instead of allowing all).

## Backend is now fully complete (Phases 1–5)

Every feature from your original spec plus all approved add-ons is built:
auth for all 3 roles, eligibility-checked job browsing/applying, recruiter
job + applicant management, admin oversight + analytics + CSV export, resume
upload, and email notifications. The only remaining piece is the React
frontend to give it a UI. Let Claude know when you're ready to start that.
