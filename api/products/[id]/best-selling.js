import app, { initializeDatabase } from '../../../backend/src/app.js';

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
    
    // The URL comes as /armaf-club-de-nuit from Vercel
    // We need to reconstruct it as /api/products/:id/best-selling
    const pathParts = req.url.split('/').filter(Boolean);
    const productId = pathParts[0] || pathParts[pathParts.length - 1];
    
    // Reconstruct the full API path
    req.url = `/api/products/${productId}/best-selling`;
    
    app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
