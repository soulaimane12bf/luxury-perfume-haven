-- Cosmed Stores Database Schema for Supabase
-- Run this in Supabase SQL Editor to create all tables

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  description TEXT,
  image_url VARCHAR(255),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,
  is_best_selling BOOLEAN DEFAULT FALSE,
  tags TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  whatsapp VARCHAR(50),
  facebook_url VARCHAR(255),
  instagram_url VARCHAR(255),
  tiktok_url VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sliders table
CREATE TABLE IF NOT EXISTS sliders (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  button_text VARCHAR(100),
  button_link VARCHAR(255),
  "order" INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table (for tracking customer orders)
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_best_selling ON products(is_best_selling);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_sliders_active ON sliders(active);
CREATE INDEX IF NOT EXISTS idx_sliders_order ON sliders("order");

-- Insert default admin if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin') THEN
    INSERT INTO admins (username, password, email, whatsapp)
    VALUES (
      'admin',
      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Default password: 'password' - CHANGE THIS!
      'admin@cosmedstores.com',
      '212600000000'
    );
  END IF;
END $$;

COMMENT ON TABLE categories IS 'Product categories';
COMMENT ON TABLE products IS 'Product catalog';
COMMENT ON TABLE reviews IS 'Customer product reviews';
COMMENT ON TABLE admins IS 'Admin users';
COMMENT ON TABLE sliders IS 'Homepage sliders/banners';
COMMENT ON TABLE orders IS 'Customer orders';
