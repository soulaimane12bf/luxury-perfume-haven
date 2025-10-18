import app, { initializeDatabase } from '../../backend/src/app.js';

// Start DB initialization immediately 
let initPromise = null;
let initStarted = false;

export default async function handler(req, res) {
  try {
    // Start initialization on first request only (for cold starts)
    if (!initStarted) {
      initStarted = true;
      initPromise = initializeDatabase().catch(err => {
        console.error('✗ Database init failed:', err);
        return false;
      });
    }
    
    // Wait for initialization to complete before handling requests
    if (initPromise) {
      await initPromise;
    }
    
    // Log for debugging
    console.log('Auth handler - URL:', req.url, 'Method:', req.method);
    
    // Ensure /api/auth prefix
    if (!req.url.startsWith('/api/auth')) {
      req.url = '/api/auth' + req.url;
    }
    
    console.log('Calling Express with:', req.url);
    
    // Pass to Express app
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
