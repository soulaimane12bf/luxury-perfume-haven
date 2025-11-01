import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import './pg-loader.js'; // Force pg to be loaded

dotenv.config();

// Auto-detect database type from environment variables. Support several
// common provider-specific names (Neon/Heroku/etc.). We prefer an explicit
// URL if provided (DATABASE_URL, POSTGRES_URL, POSTGRES_URL_NO_SSL, ...).
const candidateUrls = [
  process.env.DATABASE_URL,
  process.env.POSTGRES_URL,
  process.env.DB_URL,
  process.env.POSTGRES_URL_NO_SSL,
  process.env.POSTGRES_URL_UNPOOLED,
  process.env.POSTGRES_URL_NO_POOLER,
  process.env.POSTGRES_URL_UNPOOLED,
].filter(Boolean);

const isPostgres = Boolean(
  candidateUrls.find(u => /postgres/i.test(u)) ||
  process.env.POSTGRES_HOST ||
  process.env.PGHOST_UNPOOLED ||
  process.env.PGHOST
);

const useUrl = candidateUrls.length > 0;

const dialect = isPostgres ? 'postgres' : 'mysql';

const commonOptions = {
  dialect,
  logging: false,
  pool: {
    max: 3, // Increase for Supabase
    min: 0,
    acquire: 60000, // Increase timeout for Supabase (60 seconds)
    idle: 10000, // Increase idle time
    evict: 10000, // Increase eviction timeout
  },
  dialectOptions: {},
};

// Configure SSL for both PostgreSQL and MySQL cloud databases
if (isPostgres) {
  commonOptions.dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false // Required for Neon and other cloud PostgreSQL
  };
} else if (process.env.DB_USE_SSL === 'true') {
  commonOptions.dialectOptions.ssl = { require: true };
}

// Prefer a URL if available (support several env names commonly used by Neon)
const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DB_URL ||
  process.env.POSTGRES_URL_NO_SSL ||
  process.env.POSTGRES_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NO_POOLER ||
  null;

// Detect whether any DB configuration is present. If not, fall back to an
// in-memory SQLite database. This makes the server responsive on Vercel
// even when no external DB is configured (fast cold starts, seeded demo data).
const hasDbConfig = useUrl || Boolean(process.env.DB_HOST || process.env.DB_NAME || process.env.DB_USER);

let sequelize;
if (!hasDbConfig) {
  console.warn('No external DB configuration found — using in-memory SQLite fallback.');
  // When using the in-memory fallback, make sure we seed demo data so public
  // GET endpoints return meaningful content.
  process.env.SEED = process.env.SEED || 'true';

  sequelize = new Sequelize('sqlite::memory:', {
    ...commonOptions,
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });
} else if (useUrl) {
  // Create sequelize instance with connection reuse for serverless
  sequelize = new Sequelize(databaseUrl, {
    ...commonOptions,
    // Optimize for serverless - reuse connections
    pool: {
      ...commonOptions.pool,
      // Allow connection reuse across function invocations
      evict: 60000 // Keep connections alive for 1 minute
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'perfume_haven',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      ...commonOptions,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || (isPostgres ? 5432 : 3306)
    }
  );
}

// Handle connection errors gracefully
// Try to authenticate but don't crash the process on failure. Errors are
// handled by the initializeDatabase flow in app.js which sets readiness.
sequelize.authenticate().catch(err => {
  console.error('Database connection error:', err && err.message ? err.message : err);
});

// Export a flag so other modules (app.js) know whether we're using the
// in-memory fallback and can proceed with initialization accordingly.
export const USING_IN_MEMORY_FALLBACK = !hasDbConfig;

export default sequelize;
