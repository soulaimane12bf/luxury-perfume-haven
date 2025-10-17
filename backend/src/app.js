import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import sequelize from './config/database.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import reviewRoutes from './routes/reviews.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';

import Product from './models/product.js';
import Category from './models/category.js';
import Review from './models/review.js';
import Admin from './models/admin.js';
import Order from './models/order.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection and Database Setup
async function initializeDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    // Sync models with database (creates tables if they don't exist)
    await sequelize.sync({ force: true }); // This will drop tables and recreate
    console.log('✅ Database tables synchronized');

    // Seed database
    await seedDatabase();
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
}

// Seed database with initial data
async function seedDatabase() {
  try {
    // Check if data already exists
    const productCount = await Product.count();
    const categoryCount = await Category.count();
    const reviewCount = await Review.count();
    const adminCount = await Admin.count();
    
    if (productCount === 0 || categoryCount === 0 || reviewCount === 0) {
      console.log('📦 Seeding database...');
      const seedData = JSON.parse(
        fs.readFileSync(join(__dirname, 'data', 'seed.json'), 'utf-8')
      );
      
      if (productCount === 0) {
        await Product.bulkCreate(seedData.products);
        console.log(`   ✓ Inserted ${seedData.products.length} products`);
      }
      
      if (categoryCount === 0) {
        await Category.bulkCreate(seedData.categories);
        console.log(`   ✓ Inserted ${seedData.categories.length} categories`);
      }
      
      if (reviewCount === 0) {
        await Review.bulkCreate(seedData.reviews);
        console.log(`   ✓ Inserted ${seedData.reviews.length} reviews`);
      }
    }
    
    // Create default admin if none exists
    if (adminCount === 0) {
      await Admin.create({
        username: 'admin',
        email: 'admin@parfumeurwalid.com',
        password: 'admin123', // Will be hashed by the model
        role: 'super-admin'
      });
      console.log('   ✓ Created default admin (username: admin, password: admin123)');
    }
    
    console.log('✅ Database ready');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Parfumeur Walid API is running',
    database: 'MySQL',
    connected: sequelize.connectionManager.pool !== null
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize database then start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
