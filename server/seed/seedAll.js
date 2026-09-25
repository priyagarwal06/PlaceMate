// Populates the database with a full set of test data.
//
// Creates:
// 1 admin
// 4 students
// 9 recruiters
// 15 jobs
// 6 applications
//
// Safe to re-run:
// It only deletes/recreates accounts using @seed.placemate.com.
//
// Run with:
// node seed/seedAll.js

import dotenv from 'dotenv';
import connectDB from '../config/db.js';

import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import RecruiterProfile from '../models/RecruiterProfile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

dotenv.config();

const SEED_DOMAIN = '@seed.placemate.com';
const SAMPLE_PASSWORD = 'Passw0rd!';

const run = async () => {
  await connectDB();

  // =========================================================
  // CLEAR PREVIOUS SEED DATA
  // =========================================================

  console.log('Clearing previous seed data (if any)...');

  const existingSeedUsers = await User.find({
    email: { $regex: `${SEED_DOMAIN}$` }
  });

  const existingSeedUserIds = existingSeedUsers.map(
    (user) => user._id
  );

  await Application.deleteMany({
    student: { $in: existingSeedUserIds }
  });

  await Job.deleteMany({
    postedBy: { $in: existingSeedUserIds }
  });

  await StudentProfile.deleteMany({
    user: { $in: existingSeedUserIds }
  });

  await RecruiterProfile.deleteMany({
    user: { $in: existingSeedUserIds }
  });

  await User.deleteMany({
    email: { $regex: `${SEED_DOMAIN}$` }
  });

  // =========================================================
  // ADMIN
  // =========================================================

  console.log('Creating admin...');

  await User.create({
    name: 'Admin User',
    email: `admin${SEED_DOMAIN}`,
    phone: '9000000000',
    password: SAMPLE_PASSWORD,
    role: 'admin',
    isActive: true,
  });

  // =========================================================
  // STUDENTS
  // =========================================================

  console.log('Creating students...');

  const studentDefs = [
    {
      name: 'Priya Sharma',
      phone: '9876543210',
      branch: 'CSE',
      cgpa: 8.7,
      skills: [
        'Java',
        'SQL',
        'React',
        'JavaScript',
        'Python'
      ],
    },

    {
      name: 'Rahul Mehta',
      phone: '9876543211',
      branch: 'IT',
      cgpa: 7.8,
      skills: [
        'Java',
        'SQL'
      ],
    },

    {
      name: 'Ananya Iyer',
      phone: '9876543212',
      branch: 'ECE',
      cgpa: 6.8,
      skills: [
        'Python',
        'SQL',
        'React',
        'JavaScript'
      ],
    },

    {
      name: 'Karan Verma',
      phone: '9876543213',
      branch: 'CSE',
      cgpa: 9.1,
      skills: [
        'Java',
        'SQL',
        'Python',
        'React',
        'JavaScript'
      ],
    },
  ];

  const students = {};

  for (const studentData of studentDefs) {
    const emailSlug = studentData.name
      .split(' ')[0]
      .toLowerCase();

    const user = await User.create({
      name: studentData.name,
      email: `${emailSlug}${SEED_DOMAIN}`,
      phone: studentData.phone,
      password: SAMPLE_PASSWORD,
      role: 'student',
      isActive: true,
    });

    await StudentProfile.create({
      user: user._id,
      branch: studentData.branch,
      cgpa: studentData.cgpa,
      skills: studentData.skills,
    });

    students[studentData.name] = user;
  }

  // =========================================================
  // RECRUITERS
  // =========================================================

  console.log('Creating recruiters...');

  const recruiterDefs = [
    {
      name: 'Rohan Kapoor',
      phone: '9123456780',
      companyName: 'ABC Technologies',
      companyDescription: 'Enterprise software services',
    },

    {
      name: 'Neha Kulkarni',
      phone: '9123456781',
      companyName: 'PixelCraft',
      companyDescription: 'Product design & frontend studio',
    },

    {
      name: 'Amit Sharma',
      phone: '9123456782',
      companyName: 'Accenture',
      companyDescription: 'Technology and consulting services',
    },

    {
      name: 'Sneha Verma',
      phone: '9123456783',
      companyName: 'IBM',
      companyDescription: 'Technology and enterprise solutions',
    },

    {
      name: 'Arjun Mehta',
      phone: '9123456784',
      companyName: 'XiaomiTechnology',
      companyDescription: 'Technology and consumer electronics',
    },

    {
      name: 'Kavya Singh',
      phone: '9123456785',
      companyName: 'PwC',
      companyDescription: 'Professional services and consulting',
    },

    {
      name: 'Rahul Kapoor',
      phone: '9123456786',
      companyName: 'Deloitte',
      companyDescription: 'Consulting and professional services',
    },

    {
      name: 'Nisha Gupta',
      phone: '9123456787',
      companyName: 'JPMorganChase',
      companyDescription: 'Financial services and technology',
    },

    {
      name: 'Aditya Rao',
      phone: '9123456788',
      companyName: 'SonyIndia',
      companyDescription: 'Technology and electronics',
    },
  ];

  const recruiters = {};

  for (const recruiterData of recruiterDefs) {
    const emailSlug = recruiterData.companyName
      .toLowerCase()
      .replace(/\s+/g, '');

    const user = await User.create({
      name: recruiterData.name,
      email: `${emailSlug}${SEED_DOMAIN}`,
      phone: recruiterData.phone,
      password: SAMPLE_PASSWORD,
      role: 'recruiter',
      isApproved: true,
      isActive: true,
    });

    await RecruiterProfile.create({
      user: user._id,
      companyName: recruiterData.companyName,
      companyDescription: recruiterData.companyDescription,
    });

    recruiters[recruiterData.companyName] = user;
  }

  // =========================================================
  // JOBS
  // =========================================================

  console.log('Creating jobs...');

  const jobDefs = [
    // -------------------------
    // ABC Technologies
    // -------------------------
    {
      company: 'ABC Technologies',
      title: 'Software Developer',
      minCGPA: 7.5,
      branch: ['CSE', 'IT'],
      skills: ['Java', 'SQL'],
    },

    {
      company: 'ABC Technologies',
      title: 'Backend Engineer',
      minCGPA: 8.0,
      branch: ['CSE'],
      skills: ['Java', 'SQL', 'Python'],
    },

    // -------------------------
    // PixelCraft
    // -------------------------
    {
      company: 'PixelCraft',
      title: 'Frontend Developer',
      minCGPA: 6.5,
      branch: ['CSE', 'IT', 'ECE'],
      skills: ['React', 'JavaScript'],
    },

    {
      company: 'PixelCraft',
      title: 'Data Analyst',
      minCGPA: 7.0,
      branch: ['CSE', 'IT'],
      skills: ['SQL', 'Python'],
    },

    // -------------------------
    // Accenture
    // -------------------------
    {
      company: 'Accenture',
      title: 'Software Engineer',
      minCGPA: 6.5,
      branch: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },

    {
      company: 'Accenture',
      title: 'Business Analyst',
      minCGPA: 6.5,
      branch: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },

    // -------------------------
    // IBM
    // -------------------------
    {
      company: 'IBM',
      title: 'Software Engineer',
      minCGPA: 6.5,
      branch: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },

    {
      company: 'IBM',
      title: 'Data Analyst',
      minCGPA: 6.5,
      branch: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },

    // -------------------------
    // XiaomiTechnology
    // -------------------------
    {
      company: 'XiaomiTechnology',
      title: 'Software Engineer',
      minCGPA: 6.5,
      branch: ['CSE', 'IT', 'ECE'],
      skills: [],
    },

    // -------------------------
    // PwC
    // -------------------------
    {
      company: 'PwC',
      title: 'Business Analyst',
      minCGPA: 6.5,
      branch: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },

    // -------------------------
    // Deloitte
    // -------------------------
    {
      company: 'Deloitte',
      title: 'Business Analyst',
      minCGPA: 6.5,
      branch: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },

    {
      company: 'Deloitte',
      title: 'Software Engineer',
      minCGPA: 6.5,
      branch: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },

    // -------------------------
    // JPMorganChase
    // -------------------------
    {
      company: 'JPMorganChase',
      title: 'Data Analyst',
      minCGPA: 8.0,
      branch: ['CSE', 'IT'],
      skills: [],
    },

    {
      company: 'JPMorganChase',
      title: 'Software Engineer',
      minCGPA: 8.0,
      branch: ['CSE', 'IT'],
      skills: [],
    },

    // -------------------------
    // SonyIndia
    // -------------------------
    {
      company: 'SonyIndia',
      title: 'Design Engineer',
      minCGPA: 6.5,
      branch: ['ECE', 'EE', 'CSE', 'IT'],
      skills: [],
    },
  ];

  const jobs = {};

  for (const jobData of jobDefs) {
    const job = await Job.create({
      postedBy: recruiters[jobData.company]._id,
      title: jobData.title,
      company: jobData.company,
      description: `${jobData.title} role at ${jobData.company}.`,
      minCGPA: jobData.minCGPA,
      branch: jobData.branch,
      skills: jobData.skills,
    });

    // Company + title prevents duplicate-title collisions.
    const jobKey = `${jobData.company}__${jobData.title}`;

    jobs[jobKey] = job;
  }

  // =========================================================
  // APPLICATIONS
  // =========================================================

  console.log('Creating applications...');

  const applicationDefs = [
    {
      student: 'Priya Sharma',
      company: 'ABC Technologies',
      job: 'Software Developer',
      status: 'Shortlisted',
    },

    {
      student: 'Priya Sharma',
      company: 'PixelCraft',
      job: 'Data Analyst',
      status: 'Selected',
    },

    {
      student: 'Rahul Mehta',
      company: 'ABC Technologies',
      job: 'Software Developer',
      status: 'Pending',
    },

    {
      student: 'Ananya Iyer',
      company: 'PixelCraft',
      job: 'Frontend Developer',
      status: 'Pending',
    },

    {
      student: 'Karan Verma',
      company: 'ABC Technologies',
      job: 'Backend Engineer',
      status: 'Rejected',
    },

    {
      student: 'Karan Verma',
      company: 'PixelCraft',
      job: 'Data Analyst',
      status: 'Selected',
    },
  ];

  for (const application of applicationDefs) {
    const jobKey =
      `${application.company}__${application.job}`;

    await Application.create({
      student: students[application.student]._id,
      job: jobs[jobKey]._id,
      status: application.status,
    });
  }

  // =========================================================
  // SUMMARY
  // =========================================================

  console.log('\n======================================');
  console.log('Seed complete! Summary:');
  console.log('======================================');

  console.log(`  Admin:       1`);
  console.log(`  Students:    ${studentDefs.length}`);
  console.log(`  Recruiters:  ${recruiterDefs.length}`);
  console.log(`  Jobs:        ${jobDefs.length}`);
  console.log(`  Applications:${applicationDefs.length}`);

  console.log('\nAll seeded accounts use password:');
  console.log(`  ${SAMPLE_PASSWORD}`);

  console.log('\nAdmin login:');
  console.log(`  admin${SEED_DOMAIN}`);

  console.log('\nStudent logins:');
  console.log(`  priya${SEED_DOMAIN}`);
  console.log(`  rahul${SEED_DOMAIN}`);
  console.log(`  ananya${SEED_DOMAIN}`);
  console.log(`  karan${SEED_DOMAIN}`);

  console.log('\nRecruiter logins:');
  for (const recruiter of recruiterDefs) {
    const emailSlug = recruiter.companyName
      .toLowerCase()
      .replace(/\s+/g, '');

    console.log(`  ${emailSlug}${SEED_DOMAIN}`);
  }

  console.log('\nAll recruiters are pre-approved.');

  process.exit(0);
};

run().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});