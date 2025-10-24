import express from 'express';
import { login, register, verifyToken, changePassword } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register); // You may want to protect this or remove it after initial setup

// Protected routes
router.get('/verify', authMiddleware, verifyToken);
router.post('/change-password', authMiddleware, changePassword);

export default router;
