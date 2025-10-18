import { Sequelize } from 'sequelize';
import pg from 'pg';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  const info = {
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDbUrl: !!process.env.DB_URL,
    postgresUrlPreview: process.env.POSTGRES_URL 
      ? process.env.POSTGRES_URL.substring(0, 30) + '...' 
      : 'not set',
  };

  // Try to connect to database
  try {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DB_URL;
    
    if (!dbUrl) {
      return res.status(500).json({ ...info, error: 'No database URL found' });
    }

    const sequelize = new Sequelize(dbUrl, {
      dialect: 'postgres',
      dialectModule: pg,
      logging: false,
      pool: {
        max: 1,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });

    await sequelize.authenticate();
    
    res.status(200).json({
      ...info,
      status: 'success',
      message: 'Database connection successful',
      dialect: sequelize.getDialect()
    });

    await sequelize.close();
  } catch (error) {
    res.status(500).json({
      ...info,
      status: 'error',
      error: error.message,
      stack: error.stack
    });
  }
}
