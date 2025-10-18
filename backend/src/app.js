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
import profileRoutes from './routes/profile.js';

import Product from './models/product.js';
import Category from './models/category.js';
import Review from './models/review.js';
import Admin from './models/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
const corsOrigin = process.env.FRONTEND_ORIGIN || true;
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

let databaseReady = false;

// MySQL ConnTerminal: Create New Terminal
// ection and Database Setup
export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    await sequelize.sync();
    console.log('✅ Database tables synchronized');

    await seedDatabase();
    databaseReady = true;
    return true;
  } catch (error) {
    databaseReady = false;
    console.error('❌ Database initialization error:', error.message);
    return false;
  }
}

// Seed database with initial data
async function seedDatabase() {
  if (process.env.SEED !== 'true') {
    return;
  }

  try {
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

    if (adminCount === 0) {
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        phone: process.env.ADMIN_WHATSAPP || null,
        smtp_email: null,
        smtp_password: null,
        password: process.env.ADMIN_PASSWORD || 'change_me_now',
        role: 'super-admin',
      });
      console.log('   ✓ Created default admin user. Update credentials immediately.');
    }

    console.log('✅ Database ready');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.json({ status: 'OK', database: 'reachable', databaseReady });
  } catch (error) {
    console.error('Health check error:', error.message);
    return res.status(503).json({ status: 'ERROR', message: 'Database connection failed' });
  }
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message || err);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
