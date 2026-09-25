import express from 'express';
import {
  getAllStudents,
  deleteStudent,
  getAllRecruiters,
  approveRecruiter,
  rejectRecruiter,
  setUserActiveStatus,
  getAllJobs,
  removeJob,
  getAllApplications,
  getAnalytics,
  exportPlacedStudents,
  exportCompanyReport,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/students', getAllStudents);
router.delete('/students/:id', deleteStudent);

router.get('/recruiters', getAllRecruiters);
router.put('/recruiters/:id/approve', approveRecruiter);
router.delete('/recruiters/:id', rejectRecruiter);

router.put('/users/:id/status', setUserActiveStatus);

router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', removeJob);

router.get('/applications', getAllApplications);

router.get('/analytics', getAnalytics);

router.get('/export/placed-students', exportPlacedStudents);
router.get('/export/company-report', exportCompanyReport);

export default router;
