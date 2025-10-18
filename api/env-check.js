// Check what environment variables are available
export default function handler(req, res) {
  const dbVars = {
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDbHost: !!process.env.DB_HOST,
    hasDbUrl: !!process.env.DB_URL,
    hasSeed: !!process.env.SEED,
    nodeEnv: process.env.NODE_ENV,
    // Show first 20 chars of connection strings if they exist
    postgresUrlPreview: process.env.POSTGRES_URL ? process.env.POSTGRES_URL.substring(0, 30) + '...' : 'not set',
    databaseUrlPreview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'not set',
  };
  
  res.status(200).json(dbVars);
}
