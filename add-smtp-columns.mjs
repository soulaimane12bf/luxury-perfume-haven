import pkg from 'pg';
const { Client } = pkg;

const supabaseClient = new Client({
  connectionString: 'postgresql://postgres.wvcwewkqxrkmuxkbqdio:NjTxoP5TTslsQOvg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function addColumns() {
  await supabaseClient.connect();
  
  console.log('Adding smtp_email and smtp_password columns...');
  
  await supabaseClient.query(`
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS smtp_email VARCHAR(255);
  `);
  
  await supabaseClient.query(`
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS smtp_password VARCHAR(255);
  `);
  
  console.log('✅ Columns added successfully');
  
  await supabaseClient.end();
}

addColumns();
