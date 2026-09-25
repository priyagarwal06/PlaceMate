import Job from '../models/Job.js';
import Application from '../models/Application.js';
import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';

// @route  POST /api/recruiter/jobs
export const createJob = async (req, res) => {
  try {
    const { title, company, description, minCGPA, branch, skills } = req.body;

    const job = await Job.create({
      postedBy: req.user._id,
      title,
      company,
      description: description || '',
      minCGPA,
      branch,
      skills: skills || [],
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/recruiter/jobs
// @desc   List jobs posted by the logged-in recruiter
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });

    // Attach an application count per job so the recruiter sees activity at a glance
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicationCount };
      })
    );

    res.json({ success: true, count: jobsWithCounts.length, data: jobsWithCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: fetch a job and confirm the logged-in recruiter owns it
const getOwnedJob = async (jobId, recruiterId) => {
  const job = await Job.findById(jobId);
  if (!job) return { error: 'Job not found', status: 404 };
  if (job.postedBy.toString() !== recruiterId.toString()) {
    return { error: 'You do not own this job posting', status: 403 };
  }
  return { job };
};

// @route  PUT /api/recruiter/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const { job, error, status } = await getOwnedJob(req.params.id, req.user._id);
    if (error) return res.status(status).json({ success: false, message: error });

    const { title, company, description, minCGPA, branch, skills, status: jobStatus } = req.body;

    if (title) job.title = title;
    if (company) job.company = company;
    if (description !== undefined) job.description = description;
    if (minCGPA !== undefined) job.minCGPA = minCGPA;
    if (branch) job.branch = branch;
    if (skills) job.skills = skills;
    if (jobStatus && ['open', 'closed'].includes(jobStatus)) job.status = jobStatus;

    await job.save();
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  DELETE /api/recruiter/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const { job, error, status } = await getOwnedJob(req.params.id, req.user._id);
    if (error) return res.status(status).json({ success: false, message: error });

    await Application.deleteMany({ job: job._id }); // clean up related applications
    await job.deleteOne();

    res.json({ success: true, message: 'Job and its applications deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/recruiter/jobs/:id/applications
// @desc   View all applicants for one of the recruiter's jobs
export const getApplicantsForJob = async (req, res) => {
  try {
    const { job, error, status } = await getOwnedJob(req.params.id, req.user._id);
    if (error) return res.status(status).json({ success: false, message: error });

    const applications = await Application.find({ job: job._id })
      .populate('student', 'name email phone')
      .sort({ createdAt: -1 });

    // Attach each applicant's branch/CGPA/skills from their StudentProfile
    const applicationsWithProfile = await Promise.all(
      applications.map(async (app) => {
        const profile = await StudentProfile.findOne({ user: app.student._id }).select(
          'branch cgpa skills'
        );
        return { ...app.toObject(), studentProfile: profile };
      })
    );

    res.json({ success: true, count: applicationsWithProfile.length, data: applicationsWithProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/recruiter/applications/:id/status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status: newStatus } = req.body;
    if (!['Pending', 'Shortlisted', 'Selected', 'Rejected'].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: Pending, Shortlisted, Selected, Rejected',
      });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You do not own the job for this application' });
    }

    application.status = newStatus;
    await application.save();

    const student = await User.findById(application.student);
    if (student) {
      sendEmail({
        to: student.email,
        subject: `Your application status has been updated: ${newStatus}`,
        html: `<p>Hi ${student.name},</p><p>Your application for <strong>${application.job.title}</strong> at <strong>${application.job.company}</strong> has been updated to: <strong>${newStatus}</strong>.</p>`,
      });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
