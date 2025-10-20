# 🚀 Quick Start Guide - Parfumeur Walid Clone

## 🎯 One-Command Setup (Fresh Codespace)

```bash
# Run the automated setup script
bash setup.sh
```

This installs MySQL, creates the database, and installs all dependencies.

## 🚀 One-Command Start

```bash
# Start both backend and frontend servers
npm run dev
```

This will start:
- **Backend API:** http://localhost:5000
- **Frontend:** http://localhost:8080 (or 8081 if 8080 is in use)

### Alternative: Run Servers Separately

```bash
# Terminal 1: Backend only
npm run dev:backend

# Terminal 2: Frontend only  
npm run dev:frontend
```

## ✅ Project is Ready!

Both servers are now running:
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:5000

## 📍 Available Routes

### Public Pages
- **Homepage:** http://localhost:8080/
- **Best Sellers:** http://localhost:8080/best-sellers
- **Collection (All):** http://localhost:8080/collection
- **Men's Collection:** http://localhost:8080/collection/men
- **Women's Collection:** http://localhost:8080/collection/women
- **Product Detail:** http://localhost:8080/product/{product-id}
  - Example: http://localhost:8080/product/creed-absolu-aventus

### Admin Dashboard
- **Admin Panel:** http://localhost:8080/admin
  - View all products, categories, and reviews
  - Manage best-selling status
  - Approve/delete reviews
  - CRUD operations for products and categories

## 🎯 Features to Test

### 1. Browse Products
- Visit homepage to see featured products
- Click on any product card to view details
- Explore the image gallery
- See perfume notes (main accords and top notes)
- Read product descriptions

### 2. Filtering System
- Go to `/collection` or `/collection/men`
- Use the filter sidebar (desktop) or filter button (mobile)
- Filter by:
  - **Brand** (Creed, Dior, YSL, Tom Ford, Chanel, etc.)
  - **Price Range** (slider from 0 to 5000 DH)
  - **Type** (PRODUIT / TESTEUR)
  - **Best Selling** (toggle)
- Sort by price, newest, oldest

### 3. Reviews System
- On any product page, scroll to reviews section
- Add a review:
  - Enter your name
  - Select rating (1-5 stars)
  - Write a comment
  - Submit
- Reviews need admin approval before appearing
- Go to `/admin` → Reviews tab to approve

### 4. Best Sellers
- Visit http://localhost:8080/best-sellers
- See all products marked as best-selling
- In admin panel, toggle any product's best-selling status

### 5. Admin Dashboard
Navigate to http://localhost:8080/admin

**Dashboard Home:**
- See statistics:
  - Total products
  - Total categories
  - Number of best sellers
  - Pending reviews

**Products Tab:**
- View all products with images, prices, stock
- Edit or delete products
- See product type badges

**Categories Tab:**
- Manage all categories
- Edit or delete categories

**Reviews Tab:**
- See all reviews (approved and pending)
- Approve pending reviews with green check
- Delete reviews with red trash icon
- View ratings and comments

**Best Sellers Tab:**
- Toggle best-selling status for any product
- Changes reflect immediately on frontend

## 📦 Sample Data

The database is pre-populated with:

### Products (8 items):
1. **BARAONDA Nasomatto** - 1680 DH
2. **CREED ABSOLU AVENTUS 75ML** - 3500 DH ⭐ Best Seller
3. **MYSLF Le Parfum (YSL)** - 1280 DH ⭐ Best Seller
4. **DIOR SAUVAGE EDP 100ML** - 2200 DH ⭐ Best Seller
5. **ARMAF CLUB DE NUIT INTENSE** - 450 DH (TESTEUR)
6. **CHANEL COCO MADEMOISELLE** - 2800 DH ⭐ Best Seller
7. **LATTAFA ASAD EDP 100ML** - 380 DH
8. **TOM FORD OUD WOOD 100ML** - 4200 DH ⭐ Best Seller

### Categories (8 items):
- عطور الرجال (men)
- عطور النساء (women)
- Coffret Cadeau (gift-sets)
- ARMAF (armaf)
- عطور الجسم و مزيل العرق (body-deo)
- الشعر و التجميل (beauty)
- عينات العطور (samples)
- أقل من 200 درهم (under-200)

### Reviews (8 items):
- Multiple reviews for different products
- Some approved, some pending

## 🔧 API Testing

You can test the API directly:

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Get Best Selling Products
```bash
curl http://localhost:5000/api/products/best-selling
```

### Get Product by ID
```bash
curl http://localhost:5000/api/products/creed-absolu-aventus
```

### Get All Categories
```bash
curl http://localhost:5000/api/categories
```

### Get Reviews for a Product
```bash
curl http://localhost:5000/api/reviews/product/creed-absolu-aventus
```

### Filter Products by Brand and Price
```bash
curl "http://localhost:5000/api/products?brand=Creed&minPrice=1000&maxPrice=4000"
```

### Create a Review (POST)
```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "dior-sauvage",
    "name": "Ahmed",
    "rating": 5,
    "comment": "عطر رائع جداً!"
  }'
```

## 🛠️ Stopping the Servers

Press `Ctrl+C` in each terminal where the servers are running.

## 🔄 Restarting

If you need to restart:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
npm run dev
```

## 📝 Notes

- The backend uses **MongoDB in-memory** (data resets on restart)
- For persistent data, configure a real MongoDB connection in `backend/.env`
- Admin routes don't require authentication (add in production)
- All sample product images use Unsplash placeholder images

## 🎨 UI Features

- **Responsive Design** - Works on mobile, tablet, desktop
- **Dark Mode Support** - Theme toggle in header
- **Smooth Animations** - Hover effects and transitions
- **Arabic/RTL Support** - Right-to-left text direction
- **Toast Notifications** - User feedback for actions
- **Loading States** - Spinners and skeleton screens

## 🚀 Next Steps

1. **Add Shopping Cart** - Implement cart state management
2. **User Authentication** - Add login/register
3. **Checkout Process** - Payment integration
4. **Order Management** - Track orders
5. **Email Notifications** - Confirmation emails
6. **Search Functionality** - Product search
7. **Wishlist** - Save favorite products

Enjoy exploring your Parfumeur Walid clone! 🌟
