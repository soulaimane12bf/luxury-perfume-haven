import app, { initializeDatabase } from '../backend/src/app.js';

// Initialize database on cold start
let isInitialized = false;
let initPromise = null;

async function initialize() {
  if (!isInitialized && !initPromise) {
    initPromise = initializeDatabase()
      .then(() => {
        isInitialized = true;
        console.log('✓ Database initialized');
      })
      .catch(err => {
        console.error('✗ Database init failed:', err);
        initPromise = null; // Allow retry
      });
  }
  return initPromise;
}

export default async function handler(req, res) {
  try {
    // Initialize database
    await initialize();
    
    // Normalize the path for Express
    const originalUrl = req.url;
    req.url = originalUrl.replace('/api', '') || '/';
    
    // Set base path
    req.baseUrl = '/api';
    req.path = req.url;
    
    // Call Express app
    await new Promise((resolve, reject) => {
      // Override res.end to know when response is complete
      const originalEnd = res.end;
      res.end = function(...args) {
        originalEnd.apply(res, args);
        resolve();
      };
      
      // Set timeout
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 25000); // Vercel has 30s limit
      
      // Handle the request
      app(req, res, (err) => {
        clearTimeout(timeout);
        if (err) reject(err);
        else resolve();
      });
    });
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
