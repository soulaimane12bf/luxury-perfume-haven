import app, { initializeDatabase } from '../backend/src/app.js';

// Start DB initialization immediately 
let initPromise = null;
let initStarted = false;

export default async function handler(req, res) {
  try {
    // Start initialization on first request only (for cold starts)
    if (!initStarted) {
      initStarted = true;
      const start = Date.now();
      initPromise = initializeDatabase().then((r) => {
        console.log(`[API Handler] initializeDatabase finished in ${Date.now()-start}ms -> ${r}`);
        return r;
      }).catch(err => {
        console.error('✗ Database init failed:', err && err.message ? err.message : err);
        return false;
      });
    }
    
    // For modifying requests (POST/PUT/PATCH/DELETE), wait for DB to be ready
    // This prevents 503 errors on write operations during cold start
    const isModifyingRequest = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    if (isModifyingRequest && initPromise) {
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
  const handlerStart = Date.now();
  app(req, res);
  console.log(`[API Handler] request forwarded to Express in ${Date.now()-handlerStart}ms`);
    
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
