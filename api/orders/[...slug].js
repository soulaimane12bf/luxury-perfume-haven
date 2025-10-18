import app, { initializeDatabase } from '../../backend/src/app.js';

let initPromise = null;
let initStarted = false;

export default async function handler(req, res) {
  try {
    if (!initStarted) {
      initStarted = true;
      initPromise = initializeDatabase().catch(err => {
        console.error('✗ Database init failed:', err);
        return false;
      });
    }
    
    if (initPromise) {
      await initPromise;
    }
    
    if (!req.url.startsWith('/api/orders')) {
      req.url = '/api/orders' + req.url;
    }
    
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
