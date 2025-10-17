import express from 'express';
import { getProfile, updateProfile, updatePassword } from '../controllers/profileController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All profile routes require authentication
router.get('/', authMiddleware, getProfile);
router.patch('/', authMiddleware, updateProfile);
router.patch('/password', authMiddleware, updatePassword);

export default router;
