\# PlaceMate – Smart Placement Portal



PlaceMate is a full-stack placement management portal designed to connect students, recruiters, and administrators on a single platform.



The system helps students discover eligible job opportunities, apply for jobs, and track application status. Recruiters can post jobs and manage applicants, while administrators can monitor users, jobs, applications, and placement analytics.



\## Features



\### Student



\- Student registration and login

\- Student profile management

\- Branch, CGPA, and skills management

\- Browse available job opportunities

\- Filter jobs by company, branch, and skills

\- Automatic eligibility checking based on:

&#x20; - CGPA

&#x20; - Branch

&#x20; - Required skills

\- Apply for eligible jobs

\- Track submitted applications

\- View application status:

&#x20; - Pending

&#x20; - Shortlisted

&#x20; - Selected

&#x20; - Rejected



\### Recruiter



\- Recruiter registration and login

\- Company profile management

\- Recruiter approval workflow

\- Post new job opportunities

\- Select eligible branches and required skills

\- Manage posted jobs

\- View applicants for each job

\- View applicant profile information

\- Update application status



\### Admin



\- Secure admin login

\- Admin dashboard

\- View students

\- Activate/deactivate student accounts

\- Delete students

\- View recruiters

\- Approve/reject recruiters

\- Monitor jobs

\- Monitor applications

\- View placement analytics

\- Export placement and company reports



\## Tech Stack



\### Frontend



\- React.js

\- Vite

\- Tailwind CSS

\- Axios

\- JavaScript



\### Backend



\- Node.js

\- Express.js

\- JWT Authentication

\- bcrypt

\- REST APIs



\### Database



\- MongoDB

\- Mongoose



\### Other Technologies



\- Git \& GitHub

\- Cloudinary for file uploads

\- Nodemailer for email-related functionality



\## System Roles



| Role | Main Responsibilities |

|------|-----------------------|

| Student | Manage profile, find eligible jobs, apply, track applications |

| Recruiter | Post jobs, view applicants, update application status |

| Admin | Manage users, jobs, applications and analytics |



\## Application Workflow



```text

Student Registration

&#x20;       ↓

Student Profile

&#x20;       ↓

Browse Jobs

&#x20;       ↓

Eligibility Check

(CGPA + Branch + Skills)

&#x20;       ↓

Apply

&#x20;       ↓

Pending

&#x20;       ↓

Shortlisted / Rejected

&#x20;       ↓

Selected

