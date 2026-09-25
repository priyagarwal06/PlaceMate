import StudentProfile from '../models/StudentProfile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { checkEligibility } from '../utils/eligibility.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// @route  GET /api/student/profile
export const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email phone'
    );
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/student/profile
export const updateProfile = async (req, res) => {
  try {
    const { branch, cgpa, skills } = req.body;

    if (cgpa !== undefined && (cgpa < 0 || cgpa > 10)) {
      return res.status(400).json({ success: false, message: 'CGPA must be between 0 and 10' });
    }
    if (skills !== undefined && !Array.isArray(skills)) {
      return res.status(400).json({ success: false, message: 'Skills must be an array of strings' });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { ...(branch && { branch }), ...(cgpa !== undefined && { cgpa }), ...(skills && { skills }) } },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/jobs
// @query  company, branch, skill, eligibleOnly=true
export const listJobs = async (req, res) => {
  try {
    const { company, branch, skill, eligibleOnly } = req.query;

    const filter = { status: 'open' };
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (branch) filter.branch = { $regex: branch, $options: 'i' };
    if (skill) filter.skills = { $regex: skill, $options: 'i' };

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).populate('postedBy', 'name');

    const studentProfile = await StudentProfile.findOne({ user: req.user._id });

    let jobsWithEligibility = jobs.map((job) => {
      const eligibility = studentProfile ? checkEligibility(job, studentProfile) : null;
      return { ...job.toObject(), eligibility };
    });

    if (eligibleOnly === 'true' && studentProfile) {
      jobsWithEligibility = jobsWithEligibility.filter((j) => j.eligibility.eligible);
    }

    res.json({ success: true, count: jobsWithEligibility.length, data: jobsWithEligibility });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  POST /api/jobs/:id/apply
export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Complete your student profile before applying' });
    }

    const eligibility = checkEligibility(job, studentProfile);
    if (!eligibility.eligible) {
      return res.status(400).json({
        success: false,
        message: 'You are not eligible for this job',
        reasons: eligibility.reasons,
      });
    }

    const existing = await Application.findOne({ student: req.user._id, job: job._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }

    const application = await Application.create({ student: req.user._id, job: job._id });
    res.status(201).json({ success: true, message: 'Application submitted', data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/student/applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('job', 'title company minCGPA branch skills status')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  POST /api/student/resume
// @desc   Upload/replace the student's resume PDF (via multipart form, field name "resume")
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume file uploaded' });
    }

    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const uploadFromBuffer = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw', // PDFs are non-image assets
            folder: 'placemate/resumes',
            public_id: `resume_${req.user._id}`,
            overwrite: true,
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadFromBuffer();

    profile.resumeUrl = result.secure_url;
    await profile.save();

    res.json({ success: true, message: 'Resume uploaded', data: { resumeUrl: profile.resumeUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
