import pkg from 'pg';
const { Client } = pkg;

const neonClient = new Client({
  connectionString: 'postgresql://neondb_owner:npg_viaU6fnRp1Th@ep-green-salad-agclkbgz-pooler.c-2.eu-central-1.aws.neon.tech/neondb',
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  await neonClient.connect();
  
  // Get columns from admins table
  const result = await neonClient.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'admins' 
    ORDER BY ordinal_position
  `);
  
  console.log('Admins table columns:');
  result.rows.forEach(row => {
    console.log(`  ${row.column_name} (${row.data_type})`);
  });
  
  // Get sample admin data
  const admins = await neonClient.query('SELECT * FROM admins LIMIT 1');
  console.log('\nSample admin record:');
  console.log(admins.rows[0]);
  
  await neonClient.end();
}

checkSchema();
