import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { validateRegisterInput } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegisterInput, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;
