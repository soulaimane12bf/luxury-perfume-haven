// Global cache for the app instance and initialization promise
let appInstance = null;
let initPromise = null;
let initStartTime = 0;

async function getApp() {
  // Return cached instance immediately
  if (appInstance) {
    console.log('[Cache] Returning cached app instance');
    return appInstance;
  }
  
  // If init is already in progress, wait for it
  if (initPromise) {
    console.log('[Cache] Init in progress, waiting...');
    return initPromise;
  }
  
  // Start new initialization
  initStartTime = Date.now();
  initPromise = (async () => {
    try {
      console.log('[Init] Starting initialization...');
      
      // Load app module
      const startLoad = Date.now();
      const module = await import('../backend/src/app.js');
      console.log(`[Init] Module loaded in ${Date.now() - startLoad}ms`);
      
      const app = module.default;
      const initDb = module.initializeDatabase;
      
      // Initialize database with timeout
      const startDb = Date.now();
      const dbTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database init timeout')), 5000)
      );
      
      await Promise.race([initDb(), dbTimeout]);
      console.log(`[Init] Database ready in ${Date.now() - startDb}ms`);
      
      appInstance = app;
      console.log(`[Init] Total init time: ${Date.now() - initStartTime}ms`);
      
      return app;
    } catch (error) {
      console.error('[Init] Failed:', error.message);
      // Reset promise so next request can retry
      initPromise = null;
      throw error;
    }
  })();
  
  return initPromise;
}

export default async function handler(req, res) {
  try {
    console.log('[Handler] Request:', req.method, req.url);
    
    // Get or initialize the app
    const app = await getApp();
    
    // Ensure URL starts with /api for Express routing
    if (!req.url.startsWith('/api')) {
      req.url = '/api' + req.url;
    }
    
    console.log('[Handler] Routing to:', req.url);
    
    // Call Express app
    app(req, res);
    
  } catch (error) {
    console.error('[Handler] Error:', error.message);
    console.error('[Handler] Stack:', error.stack);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
      });
    }
  }
}
