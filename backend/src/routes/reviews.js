import express from 'express';
import {
  getReviewsByProduct,
  getAllReviews,
  createReview,
  approveReview,
  deleteReview
} from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getReviewsByProduct);
router.post('/', createReview);

// Admin routes (protected)
router.get('/', authMiddleware, getAllReviews);
router.patch('/:id/approve', authMiddleware, approveReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
