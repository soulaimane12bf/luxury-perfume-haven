import app, { initializeDatabase } from '../backend/src/app.js';

// Start DB initialization immediately (don't wait)
const initPromise = initializeDatabase().catch(err => {
  console.error('✗ Database init failed:', err);
  return false;
});

export default async function handler(req, res) {
  try {
    // Normalize the path for Express
    const originalUrl = req.url;
    req.url = originalUrl.replace('/api', '') || '/';
    
    // Set base path
    req.baseUrl = '/api';
    req.path = req.url;
    
    // Call Express app directly (DB middleware will handle readiness check)
    app(req, res);
    
  } catch (error) {
    console.error('Handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error.message 
      });
    }
  }
}
