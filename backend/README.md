# Parfumeur Walid Clone - Backend API

Backend API for the luxury perfume e-commerce platform.

## Features

- ✅ Product CRUD operations
- ✅ Category management
- ✅ Review system with approval
- ✅ Advanced filtering (brand, price, type, best-selling)
- ✅ Best-selling products management
- ✅ MongoDB with Mongoose
- ✅ Auto-seeding with sample data

## Installation

```bash
npm install
```

## Running the Server

### Development mode with auto-restart:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

## API Endpoints

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/best-selling` - Get best-selling products
- `GET /api/products/brands` - Get all brands
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `PATCH /api/products/:id/best-selling` - Toggle best-selling (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Reviews
- `GET /api/reviews/product/:productId` - Get reviews for product
- `POST /api/reviews` - Create review
- `GET /api/reviews` - Get all reviews (admin)
- `PATCH /api/reviews/:id/approve` - Approve review (admin)
- `DELETE /api/reviews/:id` - Delete review (admin)

## Query Parameters (Products)

- `category` - Filter by category slug
- `brand` - Filter by brand name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `type` - PRODUIT or TESTEUR
- `best_selling` - true/false
- `sort` - price-asc, price-desc, newest, oldest

Example: `/api/products?category=men&brand=Creed&sort=price-asc`
