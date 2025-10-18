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
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
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

const sequelize = useUrl
  ? new Sequelize(databaseUrl, commonOptions)
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

export default sequelize;
