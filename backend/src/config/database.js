import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const useUrl = Boolean(process.env.DB_URL);

const commonOptions = {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {},
};

if (process.env.DB_USE_SSL === 'true') {
  commonOptions.dialectOptions.ssl = { require: true };
}

const sequelize = useUrl
  ? new Sequelize(process.env.DB_URL, commonOptions)
  : new Sequelize(
      process.env.DB_NAME || 'perfume_haven',
      process.env.DB_USER || 'root',
      process.env.DB_PASSWORD || '',
      {
        ...commonOptions,
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
      }
    );

export default sequelize;
