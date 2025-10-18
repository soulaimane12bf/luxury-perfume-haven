import app, { initializeDatabase } from '../backend/src/app.js';

// Initialize database on cold start (runs once when function starts)
let dbInitialized = false;
const initPromise = (async () => {
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (err) {
      console.error('Database initialization failed:', err);
    }
  }
})();

export default async function handler(req, res) {
  try {
    // Wait for DB initialization to complete
    await initPromise;
    
    // Pass request to Express app
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
