import app, { initializeDatabase } from '../backend/src/app.js';

// Initialize database on cold start
let initialized = false;

async function handler(req, res) {
  if (!initialized) {
    await initializeDatabase();
    initialized = true;
  }
  return app(req, res);
}

export default handler;
