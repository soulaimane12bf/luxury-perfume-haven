import express from 'express';
import multer from 'multer';
import {
  getReviewsByProduct,
  getAllReviews,
  createReview,
  approveReview,
  deleteReview,
  likeReview,
  dislikeReview
} from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for memory storage (images will be uploaded to Vercel Blob)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB max per image
    files: 3 // Max 3 images per review
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public routes
router.get('/product/:productId', getReviewsByProduct);
router.post('/', upload.array('images', 3), createReview);
router.post('/:id/like', likeReview);
router.post('/:id/dislike', dislikeReview);

// Admin routes (protected)
router.get('/', authMiddleware, getAllReviews);
router.patch('/:id/approve', authMiddleware, approveReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
