import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-1-eu-west-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.wvcwewkqxrkmuxkbqdio',
  password: 'NjTxoP5TTslsQOvg',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function addColumns() {
  try {
    await client.connect();
    console.log('✓ Connected to Supabase');

    // Add images column
    await client.query(`
      ALTER TABLE reviews 
      ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
    `);
    console.log('✓ Added images column');

    // Add likes column
    await client.query(`
      ALTER TABLE reviews 
      ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0 NOT NULL;
    `);
    console.log('✓ Added likes column');

    // Add dislikes column
    await client.query(`
      ALTER TABLE reviews 
      ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0 NOT NULL;
    `);
    console.log('✓ Added dislikes column');

    // Verify columns
    const result = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'reviews'
        AND column_name IN ('images', 'likes', 'dislikes')
      ORDER BY column_name;
    `);
    
    console.log('\n✓ Columns verified:');
    console.table(result.rows);

    await client.end();
    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addColumns();
