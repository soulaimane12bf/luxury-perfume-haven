import app, { initializeDatabase } from '../backend/src/app.js';

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
    
    // Log incoming request for debugging
    console.log('[API Handler] Method:', req.method, 'URL:', req.url, 'Query:', JSON.stringify(req.query));
    
    // Vercel routes pass the URL with /api already included via routes config
    // But we need to ensure it's there for Express routing
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + req.url;
    }
    
    console.log('[API Handler] Final URL:', req.url);
    
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
