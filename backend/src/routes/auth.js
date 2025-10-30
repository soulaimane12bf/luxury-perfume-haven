
import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, register, verifyToken, changePassword, requestPasswordReset, resetPassword, getMaskedAdminEmail } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Rate limiter: max 5 login attempts per IP per 10 minutes
const loginLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 5,
	message: {
		message: 'Too many login attempts. Please try again in 10 minutes.',
		status: 429
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Public routes
router.post('/login', loginLimiter, login);
router.post('/register', register); // You may want to protect this or remove it after initial setup

// Password reset routes
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/validate-reset-token', validateResetToken);
router.get('/masked-admin-email', getMaskedAdminEmail);

// Protected routes
router.get('/verify', authMiddleware, verifyToken);
router.post('/change-password', authMiddleware, changePassword);

export default router;
