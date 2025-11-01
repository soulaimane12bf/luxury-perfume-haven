import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'aws-0-eu-central-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.wvcwewkqxrkmuxkbqdio',
  password: 'Marouane2003'
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connected to Supabase');

    // Add columns
    await client.query(`
      ALTER TABLE reviews 
      ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0;
    `);
    console.log('✅ Added images, likes, dislikes columns');

    // Create index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_reviews_likes ON reviews(likes DESC);
    `);
    console.log('✅ Created index on likes column');

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
