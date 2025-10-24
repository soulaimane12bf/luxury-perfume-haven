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
    max: 1, // Single connection for serverless
    min: 0,
    acquire: 2000, // Faster acquire timeout
    idle: 0, // Close idle connections immediately
    evict: 500, // Very quick eviction
  },
  dialectOptions: {
    // Optimize for serverless - faster connections
    connectTimeout: 2000,
    statement_timeout: 8000,
    // Connection pooling optimization
    keepAlive: true,
    keepAliveInitialDelayMillis: 0,
  },
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

// Create sequelize instance with connection reuse for serverless
const sequelize = useUrl
  ? new Sequelize(databaseUrl, {
      ...commonOptions,
      // Optimize for serverless - reuse connections
      pool: {
        ...commonOptions.pool,
        // Allow connection reuse across function invocations
        evict: 60000, // Keep connections alive for 1 minute
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'perfume_haven',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        ...commonOptions,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || (isPostgres ? 5432 : 3306),
      }
    );

// Handle connection errors gracefully
sequelize.authenticate().catch(err => {
  console.error('Database connection error:', err.message);
});

export default sequelize;
