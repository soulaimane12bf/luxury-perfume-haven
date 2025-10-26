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
    // Allow vercel domains, localhost and any explicitly-configured origins.
    try {
      if (origin.includes('.vercel.app') || origin.includes('localhost')) {
        return callback(null, true);
      }

      // Support a single FRONTEND_ORIGIN or a comma-separated FRONTEND_ORIGINS
      const configured = new Set();
      if (process.env.FRONTEND_ORIGIN) configured.add(process.env.FRONTEND_ORIGIN.trim());
      if (process.env.FRONTEND_ORIGINS) {
        process.env.FRONTEND_ORIGINS.split(',').forEach(s => {
          const v = String(s || '').trim(); if (v) configured.add(v);
        });
      }

      // Also allow the common custom domain used here
      configured.add('https://cosmedstores.com');
      configured.add('https://www.cosmedstores.com');

      if (configured.has(origin)) return callback(null, true);
    } catch (e) {
      // fall through to deny
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
// If SKIP_SYNC_ON_STARTUP is set in the environment, mark databaseReady
// immediately so serverless function instances won't block modifying
// requests while migrations are run separately. This avoids falling back to
// the in-memory sqlite path for request-time behavior in production.
if (process.env.SKIP_SYNC_ON_STARTUP === 'true') {
  databaseReady = true;
  console.log('⚠️  SKIP_SYNC_ON_STARTUP=true — marking databaseReady=true to allow modifying requests. Run migrations separately.');
}
let _initializing = false;
let _initAttempts = 0;
const _MAX_INIT_ATTEMPTS = 10;

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
  if (_initializing) return databaseReady;
  _initializing = true;
  _initAttempts++;
  // If no external database configuration is provided and we're NOT using
  // the in-memory fallback, skip initialization. When USING_IN_MEMORY_FALLBACK
  // is set, allow initialization to proceed (it will create sqlite in-memory).
  // Consider several provider-specific env names (Neon etc.) when deciding
  // whether an external DB is configured.
  const hasUrlConfig = Boolean(
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DB_URL ||
    process.env.POSTGRES_URL_NO_SSL ||
    process.env.POSTGRES_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED
  );

  if (
    !USING_IN_MEMORY_FALLBACK &&
    !hasUrlConfig &&
    !(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME)
  ) {
    console.warn(
      'No database configuration found. Skipping database initialization.'
    );
    databaseReady = false;
    return false;
  }
  try {
    // Helper to race a promise against a timeout so startup doesn't hang
    const withTimeout = (p, ms, label) =>
      Promise.race([
        p,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
        )
      ]);

    await withTimeout(sequelize.authenticate(), 15000, 'sequelize.authenticate');
    console.log('✓ Connected to the database');

    // Allow skipping sync/seed on startup (useful in production serverless).
    // If SKIP_SYNC_ON_STARTUP=true is set in the environment, we will
    // skip `sequelize.sync()` and seeding to avoid long cold-starts and
    // potential connection termination from the provider. Migrations should
    // be run separately as part of your deploy pipeline.
    if (process.env.SKIP_SYNC_ON_STARTUP === 'true') {
      console.log('⚠️  SKIP_SYNC_ON_STARTUP=true — skipping sequelize.sync() and seeding on startup');
      databaseReady = true;
      return true;
    }

    // Use a standard sync in serverless to keep startup fast. Avoid alter
    // operations on cold starts as they can be slow; use migrations in prod.
    // Race sync against a 30s timeout so we fail fast and avoid long cold-starts
    await withTimeout(sequelize.sync(), 30000, 'sequelize.sync');
    console.log('✓ Database models synchronized (sync)');

  // Attempt to seed only if SEED env var requests it. For in-memory
  // fallbacks we set SEED=true in the DB config so this will populate demo data.
  await seedDatabase();

    databaseReady = true;
    return true;
  } catch (error) {
    // Log the full error object (message + stack) to help diagnose init failures
    console.error('✗ Database initialization error:', error);
    databaseReady = false;
    _initializing = false;

    // Retry initialization after a backoff unless we've reached max attempts.
    if (_initAttempts < _MAX_INIT_ATTEMPTS) {
      const backoffMs = Math.min(30000, 5000 * _initAttempts);
      console.log(`⚠️  Will retry database initialization in ${backoffMs}ms (attempt ${_initAttempts}/${_MAX_INIT_ATTEMPTS})`);
      setTimeout(() => {
        initializeDatabase().catch(() => {});
      }, backoffMs);
    } else {
      console.warn('⚠️  Max database initialization attempts reached; will stop retrying.');
    }

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

    // No emergency fallbacks: block modifying requests until the database is ready.
    // This enforces that admin actions only run against a healthy DB.

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

// Public contact endpoint: returns the WhatsApp phone number maintained by the
// admin profile (super-admin). Falls back to ADMIN_WHATSAPP env var when not
// present. This endpoint is intentionally read-only and public so the frontend
// can display an up-to-date contact number without requiring authentication.
app.get('/api/contact', async (req, res) => {
  try {
    // Try to read the super-admin's phone from the DB if available.
    let phone = null;
    try {
      const admin = await Admin.findOne({ where: { role: 'super-admin' } });
      if (admin && admin.phone) phone = admin.phone;
    } catch (e) {
      // DB might not be available (read-only endpoints should still work);
      // we'll ignore DB errors and fall back to env var.
      console.warn('Contact endpoint: could not read admin from DB:', e.message || e);
    }

    if (!phone) {
      phone = process.env.ADMIN_WHATSAPP || null;
    }

    if (!phone) {
      return res.status(404).json({ error: 'contact_not_found', message: 'No contact phone configured' });
    }

    // Format the phone for wa.me links. Handle several common input formats
    // and ensure Moroccan mobile numbers that start with 06/07 become
    // the international form starting with 2126/2127 (i.e. drop the leading 0
    // and prefix with 212).
    const formatPhoneForWa = (raw) => {
      if (!raw) return null;
      let s = String(raw).trim();
      // remove common separators but keep leading + for now
      s = s.replace(/[^0-9+]/g, '');
      // remove leading + or international 00 prefix
      if (s.startsWith('+')) s = s.slice(1);
      if (s.startsWith('00')) s = s.slice(2);

      // If it already starts with country code 212, return as-is
      if (s.startsWith('212')) return s;

      // If it starts with a single leading 0 (local format), drop it and
      // prefix with 212. This covers 06xxxxxxx -> 2126xxxxxxx and
      // 07xxxxxxx -> 2127xxxxxxx
      if (s.startsWith('0')) {
        s = s.slice(1);
        return `212${s}`;
      }

      // If it looks like a local mobile (starts with 6 or 7 and is short),
      // prefix with 212 as well.
      if (/^[67]/.test(s)) {
        return `212${s}`;
      }

      // Fallback: return digits as-is.
      return s;
    };

    const normalized = formatPhoneForWa(phone);
    return res.json({ phone: normalized });
  } catch (err) {
    console.error('Contact endpoint error:', err.message || err);
    return res.status(500).json({ error: 'internal_error', message: 'Failed to retrieve contact' });
  }
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message || err);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
