-- Update Supabase schema to match Neon database structure

-- Drop existing products table and recreate with correct schema
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Products table (matching Neon structure)
CREATE TABLE products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255) NOT NULL,
  price NUMERIC NOT NULL,
  category VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  size VARCHAR(255),
  description TEXT,
  notes JSON,
  image_urls JSON NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  rating NUMERIC NOT NULL DEFAULT 0,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  best_selling BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  old_price NUMERIC
);

-- Reviews table (updated to match products)
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_best_selling ON products(best_selling);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
