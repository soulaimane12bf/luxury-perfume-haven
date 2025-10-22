import sequelize from './src/config/database.js';
import Product from './src/models/product.js';
import Category from './src/models/category.js';

// Sample product data generator
const generateProducts = (category, categorySlug, count = 20) => {
  const products = [];
  const brands = ['لوكسوري', 'بريميوم', 'إيليت', 'رويال', 'كلاسيك', 'مودرن', 'فينتاج', 'أرتيزان'];
  const types = ['Eau de Parfum', 'Eau de Toilette', 'Parfum', 'Cologne'];
  const sizes = ['50ml', '75ml', '100ml', '125ml', '150ml'];
  
  for (let i = 1; i <= count; i++) {
    const basePrice = Math.floor(Math.random() * 500) + 100; // 100-600 DH
    const hasDiscount = Math.random() > 0.6;
    const oldPrice = hasDiscount ? Math.floor(basePrice * 1.3) : null;
    const isBestSelling = Math.random() > 0.85; // 15% chance
    
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
      rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
      reviewCount: Math.floor(Math.random() * 200),
      best_selling: isBestSelling
    });
  }
  
  return products;
};

async function seedProducts() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Get all categories
    const categories = await Category.findAll();
    
    if (categories.length === 0) {
      console.log('⚠️ No categories found. Creating default categories...');
      
      const defaultCategories = [
        { id: 'cat-men', name: 'عطور رجالية', slug: 'men', description: 'عطور فاخرة للرجال' },
        { id: 'cat-women', name: 'عطور نسائية', slug: 'women', description: 'عطور راقية للنساء' },
        { id: 'cat-unisex', name: 'عطور للجنسين', slug: 'unisex', description: 'عطور مشتركة' }
      ];
      
      await Category.bulkCreate(defaultCategories);
      console.log('✅ Default categories created');
      
      // Fetch categories again
      const newCategories = await Category.findAll();
      categories.push(...newCategories);
    }

    console.log(`\n📦 Found ${categories.length} categories`);
    
    let totalProducts = 0;
    
    for (const category of categories) {
      console.log(`\n🔄 Seeding products for category: ${category.name} (${category.slug})`);
      
      // Delete existing products in this category
      const deletedCount = await Product.destroy({
        where: { category: category.slug }
      });
      console.log(`   🗑️  Deleted ${deletedCount} existing products`);
      
      // Generate and insert 20 products
      const products = generateProducts(category.name, category.slug, 20);
      await Product.bulkCreate(products);
      
      totalProducts += products.length;
      console.log(`   ✅ Created ${products.length} products`);
      
      // Show how many are best sellers
      const bestSellersCount = products.filter(p => p.best_selling).length;
      console.log(`   ⭐ ${bestSellersCount} marked as best sellers`);
    }

    console.log(`\n✅ Successfully seeded ${totalProducts} products across ${categories.length} categories!`);
    console.log('\n📊 Summary:');
    
    // Get statistics
    const totalCount = await Product.count();
    const bestSellersCount = await Product.count({ where: { best_selling: true } });
    const avgPrice = await Product.findAll({
      attributes: [[sequelize.fn('AVG', sequelize.col('price')), 'avgPrice']]
    });
    
    console.log(`   Total Products: ${totalCount}`);
    console.log(`   Best Sellers: ${bestSellersCount}`);
    console.log(`   Average Price: ${parseFloat(avgPrice[0].dataValues.avgPrice).toFixed(2)} DH`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts();
