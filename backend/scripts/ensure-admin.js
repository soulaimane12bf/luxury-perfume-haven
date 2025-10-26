import sequelize from '../src/config/database.js';
import Admin from '../src/models/admin.js';

async function ensureAdmin({ username, email, password, role = 'super-admin' }) {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB for admin upsert');

    const existing = await Admin.findOne({ where: { username } });
    if (existing) {
      existing.email = email;
      existing.password = password; // beforeUpdate hook will hash
      existing.role = role;
      await existing.save();
      console.log('Updated existing admin:', username);
    } else {
      await Admin.create({ username, email, password, role });
      console.log('Created new admin:', username);
    }

    process.exit(0);
  } catch (err) {
    console.error('Admin ensure error:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

const username = process.env.ADMIN_USERNAME || 'admin';
const email = process.env.ADMIN_EMAIL || 'admin@luxury-perfume-haven.com';
const password = process.env.ADMIN_PASSWORD || 'admintest';

ensureAdmin({ username, email, password });
