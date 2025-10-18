import app, { initializeDatabase, databaseReady } from './src/app.js';

const port = process.env.PORT || 5000;

const startServer = async () => {
  // Attempt to initialize the database. If it fails or no configuration is provided,
  // log a warning. The server will continue to start, allowing non‑DB routes to work.
  const ready = await initializeDatabase();
  if (!ready) {
    console.warn(
      '⚠️  Database failed to initialize or missing configuration. ' +
        'API endpoints depending on the database may not function properly.'
    );
  }

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error.message);
});
