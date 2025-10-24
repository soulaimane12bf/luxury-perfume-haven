import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBestSelling,
  toggleBestSelling,
  getBrands,
  searchProducts
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Cache middleware for public routes
const cacheMiddleware = (duration) => (req, res, next) => {
  if (!req.headers.authorization) {
    res.set('Cache-Control', `public, max-age=${duration}`);
  }
  next();
};

// Public routes with caching
router.get('/', cacheMiddleware(60), getAllProducts);
router.get('/best-selling', cacheMiddleware(60), getBestSelling);
router.get('/brands', cacheMiddleware(300), getBrands);
router.get('/search', searchProducts);
router.get('/:id', cacheMiddleware(60), getProductById);

// Admin routes (protected)
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.patch('/:id/best-selling', authMiddleware, toggleBestSelling);

export default router;
