import Product from '../models/product.js';
import sequelize from '../config/database.js';
import { Op } from 'sequelize';

// Get all products with filters
export const getAllProducts = async (req, res) => {
  try {
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
    
    const products = await Product.findAll({ where, order });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
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
