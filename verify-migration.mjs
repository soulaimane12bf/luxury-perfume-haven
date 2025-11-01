import pkg from 'pg';
const { Client } = pkg;

const supabaseClient = new Client({
  connectionString: 'postgresql://postgres.wvcwewkqxrkmuxkbqdio:NjTxoP5TTslsQOvg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function verifyData() {
  await supabaseClient.connect();
  
  console.log('=== DATA VERIFICATION ===\n');
  
  // Count records
  const categories = await supabaseClient.query('SELECT COUNT(*) FROM categories');
  console.log(`✅ Categories: ${categories.rows[0].count}`);
  
  const products = await supabaseClient.query('SELECT COUNT(*) FROM products');
  console.log(`✅ Products: ${products.rows[0].count}`);
  
  const reviews = await supabaseClient.query('SELECT COUNT(*) FROM reviews');
  console.log(`✅ Reviews: ${reviews.rows[0].count}`);
  
  const admins = await supabaseClient.query('SELECT COUNT(*) FROM admins');
  console.log(`✅ Admins: ${admins.rows[0].count}`);
  
  const sliders = await supabaseClient.query('SELECT COUNT(*) FROM sliders');
  console.log(`✅ Sliders: ${sliders.rows[0].count}`);
  
  // Verify admin credentials
  const admin = await supabaseClient.query('SELECT username, email, role FROM admins LIMIT 1');
  console.log('\n=== ADMIN ACCOUNT ===');
  console.log(`Username: ${admin.rows[0].username}`);
  console.log(`Email: ${admin.rows[0].email}`);
  console.log(`Role: ${admin.rows[0].role}`);
  
  await supabaseClient.end();
}

verifyData();
