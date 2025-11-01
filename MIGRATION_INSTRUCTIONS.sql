-- Run this SQL in Supabase SQL Editor
-- Add review images and interaction columns

ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_reviews_likes ON reviews(likes DESC);

SELECT 'Migration completed successfully! ✅' as status;
