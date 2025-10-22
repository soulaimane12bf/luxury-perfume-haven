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

const router = express.Router();

// Public routes
router.get('/active', getActiveSliders);

// Admin routes (protected)
router.get('/', authMiddleware, getAllSliders);
router.get('/:id', authMiddleware, getSliderById);
router.post('/', authMiddleware, createSlider);
router.put('/:id', authMiddleware, updateSlider);
router.delete('/:id', authMiddleware, deleteSlider);

export default router;
