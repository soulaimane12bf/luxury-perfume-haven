import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import sequelize, { USING_IN_MEMORY_FALLBACK } from './config/database.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import reviewRoutes from './routes/reviews.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import profileRoutes from './routes/profile.js';
import sliderRoutes from './routes/sliderRoutes.js';
// import seedRoutes from './routes/seedRoutes.js'; // Temporarily disabled for deployment

import Product from './models/product.js';
import Category from './models/category.js';
import Review from './models/review.js';
import Admin from './models/admin.js';
import Slider from './models/slider.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Use compression middleware (gzip/brotli when available)
app.use(compression());

// Middleware - CORS configuration for Vercel deployments
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview and production URLs
    if (
      origin.includes('.vercel.app') || 
      origin.includes('localhost') ||
      origin === process.env.FRONTEND_ORIGIN
    ) {
      return callback(null, true);
    }
    
    // Allow the specific origin if FRONTEND_ORIGIN is set
    if (process.env.FRONTEND_ORIGIN && origin === process.env.FRONTEND_ORIGIN) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 image uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Lightweight caching headers for public GET API responses (allows CDN caching)
app.use((req, res, next) => {
  try {
    // Only set cache for GET requests and when no Authorization header is present
    if (req.method === 'GET' && !req.headers.authorization && req.path.startsWith('/api')) {
      // Short TTL for dynamic content, take advantage of Vercel CDN
      res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    }
  } catch (err) {
    // ignore
  }
  next();
});


// Track the database readiness state. This will be true if the DB initializes
// successfully and false otherwise. The value is exported so other modules can
// check it and handle requests appropriately.
export let databaseReady = false;

/**
 * Initialize and seed the database if connection information is provided.
 *
 * This function attempts to authenticate and synchronize the Sequelize
 * connection. If a DATABASE_URL or explicit DB_HOST/DB_USER/DB_PASSWORD/DB_NAME
 * environment variables are not defined, the function will skip the
 * initialization and simply return false without exiting the process.
 *
 * On success, it returns true. On failure, it logs the error and returns false.
 */
export async function initializeDatabase() {
  // If no external database configuration is provided and we're NOT using
  // the in-memory fallback, skip initialization. When USING_IN_MEMORY_FALLBACK
  // is set, allow initialization to proceed (it will create sqlite in-memory).
  if (
    !USING_IN_MEMORY_FALLBACK &&
    !process.env.DATABASE_URL &&
    !process.env.POSTGRES_URL &&
    !process.env.DB_URL &&
    !(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME)
  ) {
    console.warn(
      'No database configuration found. Skipping database initialization.'
    );
    databaseReady = false;
    return false;
  }
  try {
    await sequelize.authenticate();
    console.log('✓ Connected to the database');

    // Use a standard sync in serverless to keep startup fast. Avoid alter
    // operations on cold starts as they can be slow; use migrations in prod.
    await sequelize.sync();
    console.log('✓ Database models synchronized (sync)');

  // Attempt to seed only if SEED env var requests it. For in-memory
  // fallbacks we set SEED=true in the DB config so this will populate demo data.
  await seedDatabase();

    databaseReady = true;
    return true;
  } catch (error) {
    console.error(
      '✗ Database initialization error:',
      error instanceof Error ? error.message : error
    );
    databaseReady = false;
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

// Middleware to check database readiness before processing API requests
// Allow public GET requests to proceed even when the DB is not yet ready.
// Only block modifying requests (POST/PUT/PATCH/DELETE) when the DB is unavailable.
app.use('/api', (req, res, next) => {
  if (!databaseReady) {
    const method = req.method && req.method.toUpperCase();
    if (method === 'GET' || method === 'OPTIONS') {
      // allow read-only requests to try (handlers may return cached/fallback data)
      return next();
    }

    return res.status(503).json({
      error: 'Service unavailable: database not ready',
      message:
        'The database is not configured or reachable. Read-only endpoints may still work. Configure database environment variables for full API functionality.'
    });
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/sliders', sliderRoutes);
// app.use('/api/seed', seedRoutes); // Temporarily disabled for deployment

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
