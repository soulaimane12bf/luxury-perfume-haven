import Product from '../models/product.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// Get all products with filters
export const getAllProducts = async (req, res) => {
  try {
    // Skip cache for authenticated admin requests, cache for public
    const isAdmin = req.headers.authorization;
    if (isAdmin) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    } else {
      res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=60');
    }
    
    const { category, brand, minPrice, maxPrice, type, best_selling, sort } = req.query;
    
    let where = {};
    
    if (category) where.category = category;
    if (type) where.type = type;
    if (best_selling) where.best_selling = best_selling === 'true';
    
    // Handle multiple brands
    if (brand) {
      const brands = brand.split(',');
      where.brand = { [Op.in]: brands };
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }
    
    let order = [];
    if (sort === 'price-asc') order = [['price', 'ASC']];
    else if (sort === 'price-desc') order = [['price', 'DESC']];
    else if (sort === 'newest') order = [['created_at', 'DESC']];
    else if (sort === 'oldest') order = [['created_at', 'ASC']];
    else order = [['created_at', 'DESC']]; // default
    
    const products = await Product.findAll({ 
      where, 
      order,
      attributes: { exclude: ['createdAt', 'updatedAt'] }, // Reduce payload size
      raw: true // Faster serialization
    });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    // Add cache headers (10 minutes - individual products change less often)
    res.set('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=120');
    
    const product = await Product.findOne({ 
      where: { id: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (!productData.id) {
      productData.id = `product-${Date.now()}`;
    }
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = await Product.findOne({ where: { id: req.params.id } });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get best selling products
export const getBestSelling = async (req, res) => {
  try {
    const limit = req.query.limit || 8;
    const products = await Product.findAll({ 
      where: { best_selling: true },
      limit: Number(limit)
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle best selling status
export const toggleBestSelling = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.best_selling = !product.best_selling;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get brands list
export const getBrands = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('brand')), 'brand']],
      raw: true
    });
    const brands = products.map(p => p.brand);
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json([]);
    }
    
    const searchTerm = q.trim();
    
    // Search in name, brand, category, description, and type
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { brand: { [Op.like]: `%${searchTerm}%` } },
          { category: { [Op.like]: `%${searchTerm}%` } },
          { type: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } }
        ]
      },
      limit: Number(limit),
      order: [
        // Prioritize exact name matches
        [sequelize.literal(`CASE WHEN LOWER(name) LIKE '${searchTerm.toLowerCase()}%' THEN 0 WHEN LOWER(brand) LIKE '${searchTerm.toLowerCase()}%' THEN 1 ELSE 2 END`), 'ASC'],
        ['name', 'ASC']
      ]
    });
    
    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
};
