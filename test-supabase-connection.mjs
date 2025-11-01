import pkg from 'pg';
const { Client } = pkg;

const supabaseClient = new Client({
  connectionString: 'postgresql://postgres.wvcwewkqxrkmuxkbqdio:NjTxoP5TTslsQOvg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function test() {
  try {
    await supabaseClient.connect();
    console.log('✅ Connected to Supabase');
    
    // Test admin login
    const admin = await supabaseClient.query('SELECT * FROM admins WHERE username = $1', ['admin']);
    console.log('Admin found:', admin.rows[0] ? 'YES' : 'NO');
    if (admin.rows[0]) {
      console.log('Username:', admin.rows[0].username);
      console.log('Email:', admin.rows[0].email);
      console.log('Role:', admin.rows[0].role);
      console.log('Password hash:', admin.rows[0].password.substring(0, 20) + '...');
    }
    
    // Test creating an order
    console.log('\nTesting order creation...');
    const orderId = `order-test-${Date.now()}`;
    await supabaseClient.query(
      `INSERT INTO orders (id, customer_name, customer_phone, customer_address, customer_email, items, total_amount, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [orderId, 'Test Customer', '0600000000', '123 Test St', 'test@test.com', JSON.stringify([{name: 'Test Product', quantity: 1, price: 100}]), 100, 'pending']
    );
    console.log('✅ Order created successfully');
    
    // Delete test order
    await supabaseClient.query('DELETE FROM orders WHERE id = $1', [orderId]);
    console.log('✅ Test order deleted');
    
    await supabaseClient.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

test();
