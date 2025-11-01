// Simple database info endpoint for verification
import pkg from 'pg';
const { Client } = pkg;

export default async function handler(req, res) {
  const DATABASE_URL = process.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    return res.status(500).json({ 
      error: 'DATABASE_URL not configured',
      provider: 'none'
    });
  }

  // Determine provider from connection string
  let provider = 'Unknown';
  let masked = DATABASE_URL.replace(/:[^:@]+@/, ':****@');
  
  if (DATABASE_URL.includes('supabase.com')) {
    provider = 'Supabase ✅';
  } else if (DATABASE_URL.includes('neon.tech')) {
    provider = 'Neon (OLD - Should be migrated!)';
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const dbInfo = await client.query(`
      SELECT 
        current_database() as db_name,
        current_user as db_user,
        version() as db_version
    `);
    
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM categories) as categories,
        (SELECT COUNT(*) FROM admins) as admins,
        (SELECT COUNT(*) FROM sliders) as sliders,
        (SELECT COUNT(*) FROM orders) as orders
    `);
    
    await client.end();
    
    return res.status(200).json({
      provider,
      connection: masked,
      database: dbInfo.rows[0].db_name,
      user: dbInfo.rows[0].db_user,
      version: dbInfo.rows[0].db_version.split(' ')[0] + ' ' + dbInfo.rows[0].db_version.split(' ')[1],
      data: counts.rows[0],
      status: 'Connected successfully',
      isSupabase: DATABASE_URL.includes('supabase.com')
    });
    
  } catch (error) {
    return res.status(500).json({
      provider,
      connection: masked,
      error: error.message,
      status: 'Connection failed'
    });
  }
}
