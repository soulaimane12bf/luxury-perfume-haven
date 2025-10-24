import express from 'express';
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Cache middleware
const cacheMiddleware = (duration) => (req, res, next) => {
  if (!req.headers.authorization) {
    res.set('Cache-Control', `public, max-age=${duration}`);
  }
  next();
};

// Public routes with caching
router.get('/', cacheMiddleware(120), getAllCategories);
router.get('/:slug', cacheMiddleware(120), getCategoryBySlug);

// Admin routes (protected)
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;
