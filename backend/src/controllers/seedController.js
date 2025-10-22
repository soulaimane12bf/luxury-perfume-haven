import Product from '../models/product.js';
import Category from '../models/category.js';

// Generate products for a category
const generateProducts = (category, categorySlug, count = 20) => {
  const products = [];
  const brands = ['لوكسوري', 'بريميوم', 'إيليت', 'رويال', 'كلاسيك', 'مودرن', 'فينتاج', 'أرتيزان'];
  const types = ['Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Cologne'];
  const sizes = ['50ml', '75ml', '100ml', '125ml', '150ml'];
  
  for (let i = 1; i <= count; i++) {
    const basePrice = Math.floor(Math.random() * 500) + 100;
    const hasDiscount = Math.random() > 0.6;
    const oldPrice = hasDiscount ? Math.floor(basePrice * 1.3) : null;
    const isBestSelling = Math.random() > 0.85;
    
    products.push({
      id: `product-${categorySlug}-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${category} ${brands[Math.floor(Math.random() * brands.length)]} ${i}`,
      brand: brands[Math.floor(Math.random() * brands.length)],
      price: basePrice,
      old_price: oldPrice,
      category: categorySlug,
      type: types[Math.floor(Math.random() * types.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      description: `منتج فاخر من فئة ${category} - جودة عالية ورائحة مميزة تدوم طويلاً. مثالي للاستخدام اليومي والمناسبات الخاصة.`,
      notes: {
        top: ['برغموت', 'ليمون', 'نعناع'],
        heart: ['ورد', 'ياسمين', 'لافندر'],
        base: ['عنبر', 'مسك', 'خشب الصندل']
      },
      image_urls: [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
        'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500'
      ],
      stock: Math.floor(Math.random() * 100) + 10,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 200),
      best_selling: isBestSelling
    });
  }
  
  return products;
};

export const seedProducts = async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.findAll();
    
    if (categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No categories found. Please create categories first.'
      });
    }

    let totalProducts = 0;
    const summary = [];
    
    for (const category of categories) {
      // Delete existing products in this category
      const deletedCount = await Product.destroy({
        where: { category: category.slug }
      });
      
      // Generate and insert 20 products
      const products = generateProducts(category.name, category.slug, 20);
      await Product.bulkCreate(products);
      
      const bestSellersCount = products.filter(p => p.best_selling).length;
      
      totalProducts += products.length;
      summary.push({
        category: category.name,
        slug: category.slug,
        deleted: deletedCount,
        created: products.length,
        bestSellers: bestSellersCount
      });
    }

    // Get final statistics
    const totalCount = await Product.count();
    const bestSellersCount = await Product.count({ where: { best_selling: true } });

    res.json({
      success: true,
      message: `Successfully seeded ${totalProducts} products across ${categories.length} categories`,
      summary,
      statistics: {
        totalProducts: totalCount,
        totalBestSellers: bestSellersCount,
        categories: categories.length
      }
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed products',
      error: error.message
    });
  }
};

export const clearAllProducts = async (req, res) => {
  try {
    const count = await Product.destroy({ where: {} });
    res.json({
      success: true,
      message: `Deleted ${count} products`
    });
  } catch (error) {
    console.error('Error clearing products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear products',
      error: error.message
    });
  }
};
