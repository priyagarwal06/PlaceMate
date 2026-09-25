import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import RecruiterProfile from '../models/RecruiterProfile.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import { toCSV } from '../utils/csv.js';
import { sendEmail } from '../utils/email.js';

// ---------- Students ----------

// @route  GET /api/admin/students
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    const withProfiles = await Promise.all(
      students.map(async (s) => {
        const profile = await StudentProfile.findOne({ user: s._id });
        return { ...s.toObject(), profile };
      })
    );
    res.json({ success: true, count: withProfiles.length, data: withProfiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- Delete Student ----------

// @route DELETE /api/admin/students/:id
export const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: 'student'
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Delete student profile
    await StudentProfile.deleteOne({ user: student._id });

    // Delete student's applications
    await Application.deleteMany({ student: student._id });

    // Delete student account
    await student.deleteOne();

    res.json({
      success: true,
      message: 'Student and related data deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ---------- Recruiters ----------

// @route  GET /api/admin/recruiters
export const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: 'recruiter' }).select('-password');
    const withProfiles = await Promise.all(
      recruiters.map(async (r) => {
        const profile = await RecruiterProfile.findOne({ user: r._id });
        return { ...r.toObject(), profile };
      })
    );
    res.json({ success: true, count: withProfiles.length, data: withProfiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  PUT /api/admin/recruiters/:id/approve
export const approveRecruiter = async (req, res) => {
  try {
    const recruiter = await User.findOne({ _id: req.params.id, role: 'recruiter' });
    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Recruiter not found' });
    }
    recruiter.isApproved = true;
    await recruiter.save();

    sendEmail({
      to: recruiter.email,
      subject: 'Your PlaceMate recruiter account has been approved',
      html: `<p>Hi ${recruiter.name},</p><p>Your recruiter account has been approved. You can now log in and start posting jobs on PlaceMate.</p>`,
    });

    res.json({ success: true, message: `${recruiter.name} approved`, data: recruiter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  DELETE /api/admin/recruiters/:id
// @desc   Reject/remove a recruiter account entirely (e.g. suspicious signup)
export const rejectRecruiter = async (req, res) => {
  try {
    const recruiter = await User.findOne({ _id: req.params.id, role: 'recruiter' });
    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Recruiter not found' });
    }
    await RecruiterProfile.deleteOne({ user: recruiter._id });
    await Job.deleteMany({ postedBy: recruiter._id });
    await recruiter.deleteOne();
    res.json({ success: true, message: 'Recruiter and their jobs removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- Generic account activation (students or recruiters) ----------

// @route  PUT /api/admin/users/:id/status   body: { isActive: true|false }
export const setUserActiveStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be true or false' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot deactivate an admin account' });
    }
    user.isActive = isActive;
    await user.save();
    res.json({ success: true, message: `Account ${isActive ? 'activated' : 'deactivated'}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- Jobs ----------

// @route  GET /api/admin/jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  DELETE /api/admin/jobs/:id
export const removeJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ success: true, message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- Applications ----------

// @route  GET /api/admin/applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', 'name email')
      .populate('job', 'title company')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- Analytics ----------

// @route  GET /api/admin/analytics
export const getAnalytics = async (req, res) => {
  try {
    const [totalStudents, totalRecruiters, pendingRecruiters, totalJobs, openJobs, totalApplications] =
      await Promise.all([
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'recruiter', isApproved: true }),
        User.countDocuments({ role: 'recruiter', isApproved: false }),
        Job.countDocuments(),
        Job.countDocuments({ status: 'open' }),
        Application.countDocuments(),
      ]);

    const selectedStudentIds = await Application.distinct('student', { status: 'Selected' });
    const placedCount = selectedStudentIds.length;
    const placementPercent = totalStudents > 0 ? ((placedCount / totalStudents) * 100).toFixed(2) : '0.00';

    // Branch-wise: total students vs placed students per branch
    const branchTotals = await StudentProfile.aggregate([
      { $group: { _id: '$branch', total: { $sum: 1 } } },
    ]);
    const placedProfiles = await StudentProfile.find({ user: { $in: selectedStudentIds } }).select('branch');
    const branchPlacedCounts = {};
    placedProfiles.forEach((p) => {
      branchPlacedCounts[p.branch] = (branchPlacedCounts[p.branch] || 0) + 1;
    });
    const branchWise = branchTotals.map((b) => ({
      branch: b._id,
      totalStudents: b.total,
      placed: branchPlacedCounts[b._id] || 0,
    }));

    // Company-wise hiring count (based on Selected applications)
    const companyWise = await Application.aggregate([
      { $match: { status: 'Selected' } },
      { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobInfo' } },
      { $unwind: '$jobInfo' },
      { $group: { _id: '$jobInfo.company', hired: { $sum: 1 } } },
      { $sort: { hired: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalRecruiters,
        pendingRecruiters,
        totalJobs,
        openJobs,
        totalApplications,
        placedCount,
        placementPercent: `${placementPercent}%`,
        branchWise,
        companyWise: companyWise.map((c) => ({ company: c._id, hired: c.hired })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------- CSV Exports ----------

// @route  GET /api/admin/export/placed-students
export const exportPlacedStudents = async (req, res) => {
  try {
    const selectedApps = await Application.find({ status: 'Selected' })
      .populate('student', 'name email phone')
      .populate('job', 'title company');

    const rows = await Promise.all(
      selectedApps.map(async (app) => {
        const profile = await StudentProfile.findOne({ user: app.student._id });
        return {
          name: app.student.name,
          email: app.student.email,
          phone: app.student.phone,
          branch: profile?.branch || '',
          cgpa: profile?.cgpa || '',
          company: app.job.company,
          jobTitle: app.job.title,
        };
      })
    );

    const csv = toCSV(rows, [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'branch', label: 'Branch' },
      { key: 'cgpa', label: 'CGPA' },
      { key: 'company', label: 'Company' },
      { key: 'jobTitle', label: 'Job Title' },
    ]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=placed_students.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route  GET /api/admin/export/company-report
export const exportCompanyReport = async (req, res) => {
  try {
    const report = await Application.aggregate([
      { $match: { status: 'Selected' } },
      { $lookup: { from: 'jobs', localField: 'job', foreignField: '_id', as: 'jobInfo' } },
      { $unwind: '$jobInfo' },
      { $group: { _id: '$jobInfo.company', hired: { $sum: 1 } } },
      { $sort: { hired: -1 } },
    ]);

    const rows = report.map((r) => ({ company: r._id, hired: r.hired }));
    const csv = toCSV(rows, [
      { key: 'company', label: 'Company' },
      { key: 'hired', label: 'Students Hired' },
    ]);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=company_report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
