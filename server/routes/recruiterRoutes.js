import express from 'express';
import {
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getApplicantsForJob,
  updateApplicationStatus,
} from '../controllers/recruiterController.js';
import { validateJobInput } from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('recruiter'));

router.post('/jobs', validateJobInput, createJob);
router.get('/jobs', getMyJobs);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/jobs/:id/applications', getApplicantsForJob);
router.put('/applications/:id/status', updateApplicationStatus);

export default router;
