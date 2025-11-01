-- Add review images and interaction columns
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes INTEGER DEFAULT 0;

-- Create index
CREATE INDEX IF NOT EXISTS idx_reviews_likes ON reviews(likes DESC);

-- Show success
SELECT 'Migration completed successfully!' as status;
