import express from 'express';
import { getProfile, updateProfile, getMyApplications, uploadResume } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadResumeMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.use(protect, authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/applications', getMyApplications);
router.post('/resume', uploadResumeMiddleware, uploadResume);

export default router;
