// Simple health check to test if serverless function works
export default async function handler(req, res) {
  try {
    // Try importing the app
    const { default: app, initializeDatabase, databaseReady } = await import('../backend/src/app.js');
    
    res.status(200).json({ 
      status: 'OK',
      message: 'Serverless function and imports working!',
      appType: typeof app,
      initType: typeof initializeDatabase,
      dbReady: databaseReady
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Import failed',
      message: error.message,
      stack: error.stack
    });
  }
}
