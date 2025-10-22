import express from 'express';
import { seedProducts, clearAllProducts } from '../controllers/seedController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Seed products (admin only)
router.post('/seed', verifyToken, requireAdmin, seedProducts);

// Clear all products (admin only)
router.delete('/clear', verifyToken, requireAdmin, clearAllProducts);

export default router;
