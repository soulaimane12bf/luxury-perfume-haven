import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import './pg-loader.js'; // Force pg to be loaded

dotenv.config();

// Auto-detect database type from environment variables
const isPostgres = Boolean(
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL?.includes('postgres')
);

const useUrl = Boolean(
  process.env.DATABASE_URL || 
  process.env.POSTGRES_URL || 
  process.env.DB_URL
);

const dialect = isPostgres ? 'postgres' : 'mysql';

const commonOptions = {
  dialect,
  logging: false,
  pool: {
    max: 2, // Reduce max connections for serverless (was 10)
    min: 0,
    acquire: 10000, // Reduce timeout (was 30000)
    idle: 5000, // Reduce idle time (was 10000)
    evict: 5000, // Add eviction timeout
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

// Use DATABASE_URL, POSTGRES_URL, or DB_URL if available, otherwise use individual vars
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DB_URL;

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
