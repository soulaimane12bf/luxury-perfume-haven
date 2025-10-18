import app, { initializeDatabase } from '../backend/src/app.js';

// Initialize database on cold start (runs once when function starts)
const dbInitPromise = initializeDatabase().catch(err => {
  console.error('Database initialization failed:', err);
  return false;
});

export default async function handler(req, res) {
  // Wait for DB initialization to complete
  await dbInitPromise;
  
  // Pass request to Express app
  return app(req, res);
}
