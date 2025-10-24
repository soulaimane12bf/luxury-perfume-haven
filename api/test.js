// Simple test endpoint
export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    env: {
      hasDatabase: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL),
      nodeVersion: process.version
    }
  });
}
