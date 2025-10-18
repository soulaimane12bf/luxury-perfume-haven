import app, { databaseReady } from '../../backend/src/app.js';

export default function handler(req, res) {
  // Log for debugging
  console.log('Auth handler - URL:', req.url, 'Method:', req.method);
  
  // Ensure /api/auth prefix
  if (!req.url.startsWith('/api/auth')) {
    req.url = '/api/auth' + req.url;
  }
  
  console.log('Calling Express with:', req.url);
  
  // Pass to Express app
  app(req, res);
}
