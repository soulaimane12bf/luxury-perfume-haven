import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateOrder } from '../middleware/validator.js';
import { orderLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/', orderLimiter, validateOrder, createOrder);

// Admin routes (protected)
router.get('/', authMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
router.patch('/:id/status', authMiddleware, updateOrderStatus);
router.delete('/:id', authMiddleware, deleteOrder);

export default router;
