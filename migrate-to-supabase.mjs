// Migrate data from Neon to Supabase
import pg from 'pg';
const { Client } = pg;

// Old Neon database
const neonClient = new Client({
  connectionString: 'postgresql://neondb_owner:npg_viaU6fnRp1Th@ep-green-salad-agclkbgz-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'
});

// New Supabase database
const supabaseClient = new Client({
  connectionString: 'postgresql://postgres.wvcwewkqxrkmuxkbqdio:NjTxoP5TTslsQOvg@aws-1-eu-west-1.pooler.supabase.com:6543/postgres'
});

async function migrateData() {
  try {
    console.log('🔌 Connecting to Neon database...');
    await neonClient.connect();
    
    console.log('🔌 Connecting to Supabase database...');
    await supabaseClient.connect();

    // Migrate Categories
    console.log('\n📦 Migrating categories...');
    const categories = await neonClient.query('SELECT * FROM categories ORDER BY id');
    if (categories.rows.length > 0) {
      for (const cat of categories.rows) {
        await supabaseClient.query(
          `INSERT INTO categories (id, name, slug, description, image_url, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) 
           ON CONFLICT (id) DO UPDATE SET 
           name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description, 
           image_url = EXCLUDED.image_url, updated_at = EXCLUDED.updated_at`,
          [cat.id, cat.name, cat.slug, cat.description, cat.image_url, cat.created_at, cat.updated_at]
        );
      }
      console.log(`✅ Migrated ${categories.rows.length} categories`);
    }

    // Migrate Products
    console.log('\n📦 Migrating products...');
    const products = await neonClient.query('SELECT * FROM products ORDER BY id');
    if (products.rows.length > 0) {
      for (const prod of products.rows) {
        // Convert JSON fields to strings if they're not already
        const notes = typeof prod.notes === 'string' ? prod.notes : JSON.stringify(prod.notes);
        const image_urls = typeof prod.image_urls === 'string' ? prod.image_urls : JSON.stringify(prod.image_urls);
        
        await supabaseClient.query(
          `INSERT INTO products (id, name, brand, price, category, type, size, description, notes, image_urls, stock, rating, "reviewCount", best_selling, created_at, updated_at, old_price) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::json, $10::json, $11, $12, $13, $14, $15, $16, $17) 
           ON CONFLICT (id) DO UPDATE SET 
           name = EXCLUDED.name, brand = EXCLUDED.brand, price = EXCLUDED.price, 
           category = EXCLUDED.category, type = EXCLUDED.type, size = EXCLUDED.size,
           description = EXCLUDED.description, notes = EXCLUDED.notes, image_urls = EXCLUDED.image_urls,
           stock = EXCLUDED.stock, rating = EXCLUDED.rating, "reviewCount" = EXCLUDED."reviewCount",
           best_selling = EXCLUDED.best_selling, updated_at = EXCLUDED.updated_at, old_price = EXCLUDED.old_price`,
          [prod.id, prod.name, prod.brand, prod.price, prod.category, prod.type, prod.size,
           prod.description, notes, image_urls, prod.stock, prod.rating, 
           prod.reviewCount, prod.best_selling, prod.created_at, prod.updated_at, prod.old_price]
        );
      }
      console.log(`✅ Migrated ${products.rows.length} products`);
    }

    // Migrate Reviews
    console.log('\n📦 Migrating reviews...');
    try {
      const reviews = await neonClient.query('SELECT * FROM reviews ORDER BY id');
      if (reviews.rows.length > 0) {
        for (const rev of reviews.rows) {
          // Skip if ID is not numeric (like "r5")
          if (isNaN(parseInt(rev.id))) {
            console.log(`⚠️  Skipping review with non-numeric ID: ${rev.id}`);
            continue;
          }
          await supabaseClient.query(
            `INSERT INTO reviews (product_id, customer_name, rating, comment, is_approved, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [rev.product_id, rev.customer_name, rev.rating, rev.comment, 
             rev.is_approved, rev.created_at, rev.updated_at]
          );
        }
        console.log(`✅ Migrated reviews`);
      } else {
        console.log('ℹ️  No reviews to migrate');
      }
    } catch (err) {
      console.log('⚠️  Reviews table not found or skipped:', err.message);
    }

    // Migrate Admins
    console.log('\n📦 Migrating admins...');
    const admins = await neonClient.query('SELECT * FROM admins ORDER BY id');
    if (admins.rows.length > 0) {
      for (const admin of admins.rows) {
        await supabaseClient.query(
          `INSERT INTO admins (id, username, password, email, phone, smtp_email, smtp_password, role, instagram, facebook, reset_token, reset_token_expires, token_invalid_before, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
           ON CONFLICT (id) DO UPDATE SET 
           username = EXCLUDED.username, password = EXCLUDED.password, email = EXCLUDED.email, 
           phone = EXCLUDED.phone, smtp_email = EXCLUDED.smtp_email, smtp_password = EXCLUDED.smtp_password,
           role = EXCLUDED.role, instagram = EXCLUDED.instagram, facebook = EXCLUDED.facebook, 
           reset_token = EXCLUDED.reset_token, reset_token_expires = EXCLUDED.reset_token_expires, 
           token_invalid_before = EXCLUDED.token_invalid_before, updated_at = EXCLUDED.updated_at`,
          [admin.id, admin.username, admin.password, admin.email, admin.phone, 
           admin.smtp_email, admin.smtp_password, admin.role, admin.instagram, admin.facebook,
           admin.reset_token, admin.reset_token_expires, admin.token_invalid_before, 
           admin.created_at, admin.updated_at]
        );
      }
      console.log(`✅ Migrated ${admins.rows.length} admins`);
    }

    // Migrate Sliders
    console.log('\n📦 Migrating sliders...');
    const sliders = await neonClient.query('SELECT * FROM sliders ORDER BY id');
    if (sliders.rows.length > 0) {
      for (const slider of sliders.rows) {
        await supabaseClient.query(
          `INSERT INTO sliders (id, image_url, title, subtitle, button_text, button_link, "order", active, created_at, updated_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
           ON CONFLICT (id) DO UPDATE SET 
           image_url = EXCLUDED.image_url, title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, 
           button_text = EXCLUDED.button_text, button_link = EXCLUDED.button_link, 
           "order" = EXCLUDED."order", active = EXCLUDED.active, updated_at = EXCLUDED.updated_at`,
          [slider.id, slider.image_url, slider.title, slider.subtitle, slider.button_text, 
           slider.button_link, slider.order, slider.active, slider.created_at, slider.updated_at]
        );
      }
      console.log(`✅ Migrated ${sliders.rows.length} sliders`);
    }

    // Migrate Orders (if exists)
    try {
      console.log('\n📦 Migrating orders...');
      const orders = await neonClient.query('SELECT * FROM orders ORDER BY id');
      if (orders.rows.length > 0) {
        for (const order of orders.rows) {
          await supabaseClient.query(
            `INSERT INTO orders (id, customer_name, phone, address, city, items, total_amount, status, notes, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
             ON CONFLICT (id) DO UPDATE SET 
             customer_name = EXCLUDED.customer_name, phone = EXCLUDED.phone, 
             address = EXCLUDED.address, city = EXCLUDED.city, items = EXCLUDED.items, 
             total_amount = EXCLUDED.total_amount, status = EXCLUDED.status, 
             notes = EXCLUDED.notes, updated_at = EXCLUDED.updated_at`,
            [order.id, order.customer_name, order.phone, order.address, order.city, 
             order.items, order.total_amount, order.status, order.notes, 
             order.created_at, order.updated_at]
          );
        }
        console.log(`✅ Migrated ${orders.rows.length} orders`);
      }
    } catch (err) {
      console.log('⚠️  Orders table not found or empty');
    }

    // Update sequences
    console.log('\n🔄 Updating sequences...');
    const tables = ['categories', 'products', 'reviews', 'admins', 'sliders', 'orders'];
    for (const table of tables) {
      try {
        await supabaseClient.query(
          `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1)) FROM ${table}`
        );
        console.log(`✅ Updated ${table} sequence`);
      } catch (err) {
        console.log(`⚠️  Could not update ${table} sequence`);
      }
    }

    console.log('\n\n🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await neonClient.end();
    await supabaseClient.end();
    console.log('\n🔌 Database connections closed');
  }
}

migrateData().catch(console.error);
