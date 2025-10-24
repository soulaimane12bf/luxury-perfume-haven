import express from 'express';
import {
  getAllSliders,
  getActiveSliders,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
} from '../controllers/sliderController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Cache middleware
const cacheMiddleware = (duration) => (req, res, next) => {
  if (!req.headers.authorization) {
    res.set('Cache-Control', `public, max-age=${duration}`);
  }
  next();
};

// Public routes with caching
router.get('/active', cacheMiddleware(300), getActiveSliders);

// Admin routes (protected)
router.get('/', authMiddleware, getAllSliders);
router.get('/:id', authMiddleware, getSliderById);
router.post('/', authMiddleware, upload.single('image'), createSlider);
router.put('/:id', authMiddleware, upload.single('image'), updateSlider);
router.delete('/:id', authMiddleware, deleteSlider);

export default router;
