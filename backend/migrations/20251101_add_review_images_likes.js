import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function up() {
  const sqlPath = path.join(__dirname, '20251101_add_review_images_likes.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  await sequelize.query(sql, { type: QueryTypes.RAW });
  console.log('✅ Migration: Added images, likes, dislikes to reviews table');
}

export async function down() {
  await sequelize.query(`
    ALTER TABLE reviews 
    DROP COLUMN IF EXISTS images,
    DROP COLUMN IF EXISTS likes,
    DROP COLUMN IF EXISTS dislikes;
    
    DROP INDEX IF EXISTS idx_reviews_likes;
  `, { type: QueryTypes.RAW });
  console.log('✅ Rollback: Removed images, likes, dislikes from reviews table');
}
