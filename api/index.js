// Global cache for the app instance and initialization promise
let appInstance = null;
let initPromise = null;

async function getApp() {
  if (appInstance) return appInstance;
  
  if (!initPromise) {
    initPromise = (async () => {
      try {
        console.log('[Init] Loading backend app...');
        const module = await import('../backend/src/app.js');
        const app = module.default;
        const initDb = module.initializeDatabase;
        
        console.log('[Init] Initializing database...');
        await initDb();
        
        console.log('[Init] Backend ready!');
        appInstance = app;
        return app;
      } catch (error) {
        console.error('[Init] Failed:', error.message);
        console.error('[Init] Stack:', error.stack);
        throw error;
      }
    })();
  }
  
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
