import pkg from 'pg';
const { Client } = pkg;

// Read from environment variable (like production does)
const DATABASE_URL = process.env.DATABASE_URL;

async function checkProductionConfig() {
  if (!DATABASE_URL) {
    console.log('❌ DATABASE_URL environment variable not set');
    console.log('💡 This script should be run with: DATABASE_URL=<your-connection-string> node check-production-db.mjs');
    return;
  }

  console.log('\n🔍 Checking production database configuration...\n');
  console.log('Connection string:', DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
  
  // Check if it's Supabase
  if (DATABASE_URL.includes('supabase.com')) {
    console.log('✅ Using Supabase database');
  } else if (DATABASE_URL.includes('neon.tech')) {
    console.log('⚠️  WARNING: Still using Neon database!');
  } else {
    console.log('❓ Unknown database provider');
  }
  
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connection successful\n');
    
    const dbInfo = await client.query('SELECT current_database(), current_user, version()');
    console.log('Database:', dbInfo.rows[0].current_database);
    console.log('User:', dbInfo.rows[0].current_user);
    console.log('Version:', dbInfo.rows[0].version.split(' ')[0] + ' ' + dbInfo.rows[0].version.split(' ')[1]);
    
    const products = await client.query('SELECT COUNT(*) FROM products');
    console.log('\nProducts count:', products.rows[0].count);
    
    await client.end();
    console.log('\n✅ All checks passed!\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

checkProductionConfig();
