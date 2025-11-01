import pg from 'pg';
const { Client } = pg;

const neonClient = new Client({
  connectionString: 'postgresql://neondb_owner:npg_viaU6fnRp1Th@ep-green-salad-agclkbgz-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

async function checkSchema() {
  await neonClient.connect();
  
  const result = await neonClient.query(`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    ORDER BY ordinal_position
  `);
  
  console.log('Products table schema in Neon:');
  console.table(result.rows);
  
  await neonClient.end();
}

checkSchema().catch(console.error);
