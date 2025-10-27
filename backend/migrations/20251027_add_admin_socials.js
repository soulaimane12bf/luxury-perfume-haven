import sequelize from '../src/config/database.js';
import { DataTypes } from 'sequelize';

const qi = sequelize.getQueryInterface();

export async function up() {
  try {
    console.log('Running up migration: add instagram, facebook to admins');
    await qi.addColumn('admins', 'instagram', { type: DataTypes.STRING, allowNull: true });
    await qi.addColumn('admins', 'facebook', { type: DataTypes.STRING, allowNull: true });
    console.log('Migration up completed');
    process.exit(0);
  } catch (err) {
    console.error('Migration up error:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

export async function down() {
  try {
    console.log('Running down migration: remove instagram, facebook from admins');
    await qi.removeColumn('admins', 'instagram');
    await qi.removeColumn('admins', 'facebook');
    console.log('Migration down completed');
    process.exit(0);
  } catch (err) {
    console.error('Migration down error:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

// Allow running this file directly: `node 20251027_add_admin_socials.js up|down`
if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv[2] || 'up';
  if (arg === 'up') up();
  else if (arg === 'down') down();
  else {
    console.error('Unknown argument. Use up or down');
    process.exit(1);
  }
}
