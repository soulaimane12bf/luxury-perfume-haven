import app, { initializeDatabase } from './src/app.js';

const port = process.env.PORT || 5000;

const startServer = async () => {
  const ready = await initializeDatabase();

  if (!ready) {
    console.warn('⚠️ Database is not ready. The API will still start, but requests depending on the DB may fail until the connection is restored.');
  }

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error.message);
});
