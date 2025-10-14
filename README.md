# 🌟 Luxury Perfume Haven - Parfumeur Walid Clone

A full-stack luxury perfume e-commerce platform built with React, TypeScript, Express, and MongoDB.

## ✨ Features Implemented

### 🖼️ Product Features
- ✅ **Product Single Page** with image gallery, perfume notes, and descriptions
- ✅ **Advanced Filtering System** (brand, price range, type, best-selling)
- ✅ **Best-Selling Section** with dedicated page
- ✅ **Product Ratings & Reviews** with approval system
- ✅ **Real-time Stock Management**
- ✅ **Product Types** (PRODUIT / TESTEUR)

### 🎨 Frontend Pages
- ✅ **Homepage** - Featured products and best sellers
- ✅ **Product Single** - Detailed product view with gallery and reviews
- ✅ **Collection Page** - Filtered product listings
- ✅ **Best Sellers Page** - Top-selling products
- ✅ **Admin Dashboard** - Full product and category management

### 🧑‍💼 Admin Dashboard
- ✅ **Products Management** - CRUD operations
- ✅ **Categories Management** - CRUD operations
- ✅ **Reviews Moderation** - Approve or delete reviews
- ✅ **Best Seller Toggle** - Mark products as best sellers
- ✅ **Statistics Dashboard** - Product counts and insights

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation & Running

1. **Install frontend dependencies**
   ```bash
   npm install
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Start MongoDB** (if not already running)
   ```bash
   sudo systemctl start mongodb  # Linux
   brew services start mongodb-community  # macOS
   ```

4. **Run Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on: http://localhost:5000

5. **Run Frontend Server** (Terminal 2)
   ```bash
   npm run dev
   ```
   Frontend runs on: http://localhost:8080

### 🎯 Access Points
- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:5000/api
- **Admin Dashboard:** http://localhost:8080/admin

## 📡 API Endpoints

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get single product
- `GET /api/products/best-selling` - Get best-selling products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `PATCH /api/products/:id/best-selling` - Toggle best-selling

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin)

### Reviews
- `GET /api/reviews/product/:productId` - Get reviews for product
- `POST /api/reviews` - Create review
- `GET /api/reviews` - Get all reviews (admin)
- `PATCH /api/reviews/:id/approve` - Approve review (admin)
- `DELETE /api/reviews/:id` - Delete review (admin)

## 🎨 Sample Data

The backend automatically seeds with 8 products (Creed, Dior, YSL, Tom Ford, etc.), 8 categories, and 8 reviews.

## 🛠️ Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Router  
**Backend:** Node.js, Express, MongoDB, Mongoose

## 👨‍💻 Developer

Built with ❤️ for Parfumeur Walid Clone

---

## Original Lovable Project

**URL**: https://lovable.dev/projects/7e12eb57-02ed-4a81-8fac-cf989c3664ab

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7e12eb57-02ed-4a81-8fac-cf989c3664ab) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
