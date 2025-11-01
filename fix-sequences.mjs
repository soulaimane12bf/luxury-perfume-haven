import pkg from 'pg';
const { Client } = pkg;

const supabaseClient = new Client({
  connectionString: 'postgresql://postgres.wvcwewkqxrkmuxkbqdio:NjTxoP5TTslsQOvg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function fixSequences() {
  await supabaseClient.connect();
  
  console.log('Fixing sequences...');
  
  // Categories - ID is VARCHAR so no sequence needed
  console.log('✓ Categories uses VARCHAR ID - no sequence needed');
  
  // Products - ID is VARCHAR so no sequence needed  
  console.log('✓ Products uses VARCHAR ID - no sequence needed');
  
  // Sliders - check if it has integer ID
  const sliders = await supabaseClient.query('SELECT MAX(id) as max_id FROM sliders');
  if (sliders.rows[0].max_id) {
    console.log(`Sliders max ID: ${sliders.rows[0].max_id}`);
    await supabaseClient.query(`SELECT setval('sliders_id_seq', ${sliders.rows[0].max_id}, true)`);
    console.log('✅ Updated sliders sequence');
  }
  
  await supabaseClient.end();
}

fixSequences();
