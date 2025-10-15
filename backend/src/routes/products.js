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

// Public routes
router.get('/', getAllProducts);
router.get('/best-selling', getBestSelling);
router.get('/brands', getBrands);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Admin routes (protected)
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.patch('/:id/best-selling', authMiddleware, toggleBestSelling);

export default router;
