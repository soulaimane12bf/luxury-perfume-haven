-- Add review image and interaction columns
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/wvcwewkqxrkmuxkbqdio/sql/new

-- Add images column (JSONB for storing array of image URLs)
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Add likes counter
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0 NOT NULL;

-- Add dislikes counter
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0 NOT NULL;

-- Verify columns were added
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'reviews'
  AND column_name IN ('images', 'likes', 'dislikes');
