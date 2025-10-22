import Category from '../models/category.js';

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    // Categories change rarely - cache for 15 minutes
    res.set('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=180');
    
    const categories = await Category.findAll({ 
      order: [['name', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    // Cache for 15 minutes
    res.set('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=180');
    
    const category = await Category.findOne({ 
      where: { id: req.params.id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    // Cache for 15 minutes
    res.set('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=180');
    
    const category = await Category.findOne({ 
      where: { slug: req.params.slug },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new category
export const createCategory = async (req, res) => {
  try {
    const categoryData = { ...req.body };
    if (!categoryData.id) {
      categoryData.id = `category-${Date.now()}`;
    }
    const category = await Category.create(categoryData);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const [updated] = await Category.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const category = await Category.findOne({ where: { id: req.params.id } });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
