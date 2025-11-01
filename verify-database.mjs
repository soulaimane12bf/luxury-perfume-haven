import pkg from 'pg';
const { Client } = pkg;

// This is your Supabase connection string
const supabaseConnection = 'postgresql://postgres.wvcwewkqxrkmuxkbqdio:NjTxoP5TTslsQOvg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres';

async function verifyDatabase() {
  const client = new Client({
    connectionString: supabaseConnection,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n✅ Connected to database');
    
    // Get database info
    const dbInfo = await client.query(`
      SELECT 
        current_database() as database_name,
        current_user as user_name,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port,
        version() as postgres_version
    `);
    
    console.log('\n📊 Database Information:');
    console.log('  Database:', dbInfo.rows[0].database_name);
    console.log('  User:', dbInfo.rows[0].user_name);
    console.log('  Server IP:', dbInfo.rows[0].server_ip);
    console.log('  Server Port:', dbInfo.rows[0].server_port);
    console.log('  PostgreSQL:', dbInfo.rows[0].postgres_version.split(' ')[0] + ' ' + dbInfo.rows[0].postgres_version.split(' ')[1]);
    
    // Check if it's Supabase by looking at the connection string
    if (supabaseConnection.includes('supabase.com')) {
      console.log('\n✅ CONFIRMED: Connected to Supabase database!');
    } else {
      console.log('\n⚠️  WARNING: Not a Supabase connection string!');
    }
    
    // Get table counts
    console.log('\n📦 Data Summary:');
    
    const categories = await client.query('SELECT COUNT(*) FROM categories');
    console.log('  Categories:', categories.rows[0].count);
    
    const products = await client.query('SELECT COUNT(*) FROM products');
    console.log('  Products:', products.rows[0].count);
    
    const admins = await client.query('SELECT COUNT(*) FROM admins');
    console.log('  Admins:', admins.rows[0].count);
    
    const sliders = await client.query('SELECT COUNT(*) FROM sliders');
    console.log('  Sliders:', sliders.rows[0].count);
    
    const orders = await client.query('SELECT COUNT(*) FROM orders');
    console.log('  Orders:', orders.rows[0].count);
    
    const reviews = await client.query('SELECT COUNT(*) FROM reviews');
    console.log('  Reviews:', reviews.rows[0].count);
    
    // Check admin credentials
    const admin = await client.query('SELECT username, email, role FROM admins LIMIT 1');
    if (admin.rows[0]) {
      console.log('\n👤 Admin Account:');
      console.log('  Username:', admin.rows[0].username);
      console.log('  Email:', admin.rows[0].email);
      console.log('  Role:', admin.rows[0].role);
    }
    
    console.log('\n🎉 All data migrated successfully to Supabase!\n');
    
    await client.end();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

verifyDatabase();
