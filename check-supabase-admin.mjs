import pkg from 'pg';
const { Client } = pkg;

const supabaseClient = new Client({
  connectionString: 'postgresql://postgres.wvcwewkqxrkmuxkbqdio:NjTxoP5TTslsQOvg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  await supabaseClient.connect();
  
  // Get columns from admins table
  const result = await supabaseClient.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'admins' 
    ORDER BY ordinal_position
  `);
  
  console.log('Supabase admins table columns:');
  result.rows.forEach(row => {
    console.log(`  ${row.column_name} (${row.data_type})`);
  });
  
  await supabaseClient.end();
}

checkSchema();
