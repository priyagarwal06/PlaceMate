// One-off script to insert sample jobs for testing.
// Run with: node seed/seedJobs.js
//
// Requires recruiter accounts to already exist.
// Each company's jobs are linked to that company's recruiter.

import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import RecruiterProfile from '../models/RecruiterProfile.js';
import Job from '../models/Job.js';

dotenv.config();

const run = async () => {
  await connectDB();

  // Find recruiter using company name
  const getRecruiter = async (companyName) => {
    const profile = await RecruiterProfile.findOne({
      companyName,
    });

    if (!profile) {
      console.log(`Recruiter not found for: ${companyName}`);
      return null;
    }

    return User.findById(profile.user);
  };

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
      branch: ['IT', 'CSE', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },
    {
      company: 'Accenture',
      title: 'Business Analyst',
      minCGPA: 6.5,
      branch: ['IT', 'CSE', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },

    // -------------------------
    // IBM
    // -------------------------
    {
      company: 'IBM',
      title: 'Software Engineer',
      minCGPA: 6.5,
      branch: ['IT', 'CSE', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },
    {
      company: 'IBM',
      title: 'Data Analyst',
      minCGPA: 6.5,
      branch: ['IT', 'CSE', 'ECE', 'EE', 'ME', 'CE'],
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
      branch: ['IT', 'CSE', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },

    // -------------------------
    // Deloitte
    // -------------------------
    {
      company: 'Deloitte',
      title: 'Business Analyst',
      minCGPA: 6.5,
      branch: ['IT', 'CSE', 'ECE', 'EE', 'ME', 'CE'],
      skills: [],
    },
    {
      company: 'Deloitte',
      title: 'Software Engineer',
      minCGPA: 6.5,
      branch: ['IT', 'CSE', 'ECE', 'EE', 'ME', 'CE'],
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

  let inserted = 0;
  let skipped = 0;

  for (const jobData of jobDefs) {
    const recruiter = await getRecruiter(jobData.company);

    if (!recruiter) {
      console.log(
        `Skipping: ${jobData.company} - ${jobData.title}`
      );
      skipped++;
      continue;
    }

    await Job.create({
      postedBy: recruiter._id,
      title: jobData.title,
      company: jobData.company,
      description: `${jobData.title} role at ${jobData.company}.`,
      minCGPA: jobData.minCGPA,
      branch: jobData.branch,
      skills: jobData.skills,
    });

    console.log(
      `Added: ${jobData.company} - ${jobData.title}`
    );

    inserted++;
  }

  console.log('\n==============================');
  console.log('Job seeding complete!');
  console.log(`Inserted: ${inserted}`);
  console.log(`Skipped: ${skipped}`);
  console.log('==============================');

  process.exit(0);
};

run().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});