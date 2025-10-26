import sequelize from '../src/config/database.js';

async function run() {
  try {
    console.log('Running migrations (sequelize.sync) ...');
    await sequelize.authenticate();
    // Use sync without alter/force in production by default. If you need alter,
    // do it intentionally in a migration step.
    await sequelize.sync();
    console.log('Migrations completed (sequelize.sync)');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

run();
