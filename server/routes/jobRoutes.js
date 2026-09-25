import express from 'express';
import { listJobs, applyToJob } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Phase 2: student-facing job browsing + applying.
// Phase 3 will add recruiter routes (POST /, PUT /:id, DELETE /:id) to this same router.
router.get('/', protect, authorize('student'), listJobs);
router.post('/:id/apply', protect, authorize('student'), applyToJob);

export default router;
