import app, { initializeDatabase, databaseReady } from './src/app.js';

const port = process.env.PORT || 5000;

const startServer = async () => {
  // Attempt to initialize the database but do it in the background to avoid
  // blocking server startup (useful during local dev). We still log how long
  // the initialization took so you can optimize slow steps.
  const start = Date.now();
  initializeDatabase().then((ready) => {
    console.log(`DB initializeDatabase finished in ${Date.now() - start}ms -> ${ready}`);
    if (!ready) {
      console.warn(
        '⚠️  Database failed to initialize or missing configuration. ' +
          'API endpoints depending on the database may not function properly.'
      );
    }
  }).catch((err) => {
    console.error('DB initializeDatabase error:', err && err.message ? err.message : err);
  });

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error.message);
});
