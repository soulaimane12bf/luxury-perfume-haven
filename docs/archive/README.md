# 🌟 Luxury Perfume Haven - Premium E-commerce Platform# 🌟 Luxury Perfume Haven - Parfumeur Walid Clone



<div align="center">A full-stack luxury perfume e-commerce platform built with React, TypeScript, Express, and MongoDB.



![Perfume Haven](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)## ✨ Features Implemented

![Version](https://img.shields.io/badge/Version-2.0-blue?style=for-the-badge)

![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)### 🖼️ Product Features

- ✅ **Product Single Page** with image gallery, perfume notes, and descriptions

**A full-stack luxury perfume e-commerce platform with advanced features, admin panel, and performance optimizations**- ✅ **Advanced Filtering System** (brand, price range, type, best-selling)

- ✅ **Best-Selling Section** with dedicated page

[Live Demo](https://luxury-perfume-haven.vercel.app) • [Report Bug](https://github.com/soulaimane12bf/luxury-perfume-haven/issues) • [Request Feature](https://github.com/soulaimane12bf/luxury-perfume-haven/issues)- ✅ **Product Ratings & Reviews** with approval system

- ✅ **Real-time Stock Management**

</div>- ✅ **Product Types** (PRODUIT / TESTEUR)



---### 🎨 Frontend Pages

- ✅ **Homepage** - Featured products and best sellers

## 📋 Table of Contents- ✅ **Product Single** - Detailed product view with gallery and reviews

- ✅ **Collection Page** - Filtered product listings

- [Features](#-features)- ✅ **Best Sellers Page** - Top-selling products

- [Tech Stack](#-tech-stack)- ✅ **Admin Dashboard** - Full product and category management

- [Performance](#-performance)

- [Quick Start](#-quick-start)### 🧑‍💼 Admin Dashboard

- [Configuration](#-configuration)- ✅ **Products Management** - CRUD operations

- [Admin Panel](#-admin-panel)- ✅ **Categories Management** - CRUD operations

- [WhatsApp Integration](#-whatsapp-integration)- ✅ **Reviews Moderation** - Approve or delete reviews

- [Email System](#-email-system)- ✅ **Best Seller Toggle** - Mark products as best sellers

- [Deployment](#-deployment)- ✅ **Statistics Dashboard** - Product counts and insights

- [API Documentation](#-api-documentation)

- [Project Structure](#-project-structure)## 🚀 Getting Started

- [Contributing](#-contributing)

### Prerequisites

---- Node.js (v18 or higher)

- MySQL 8.0 or higher

## ✨ Features- npm or yarn



### 🛍️ **E-commerce Features**### Quick Start (Recommended)

- 🎨 **Premium UI/UX** - Beautiful gradient designs with animations

- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop**One Command Setup & Start:**

- 🛒 **Shopping Cart** - Add to cart with quantity management```bash

- 🔍 **Advanced Search** - Real-time product searchnpm run start

- 🎯 **Smart Filtering** - Filter by brand, price, type, category```

- ⭐ **Product Reviews** - Customer ratings with approval system

- 🔥 **Best Sellers** - Dedicated section for top productsThis command will:

- 📦 **Order Management** - Complete order tracking system1. ✅ Install MySQL (if needed)

- 💬 **WhatsApp Integration** - Direct customer communication2. ✅ Configure database

- 📧 **Email Notifications** - Automated order confirmations3. ✅ Install all dependencies

4. ✅ Seed initial data

### 🎨 **User Interface**5. ✅ Start both frontend and backend servers

- ✨ Gradient backgrounds with gold accents

- 🌙 Dark mode supportFrontend: `http://localhost:8080`  

- 🎭 Smooth animations and transitionsBackend API: `http://localhost:5000`

- 💎 Premium loading skeletons

- 📸 Image galleries with zoom### Manual Installation

- 🎪 Floating WhatsApp button

- 🔔 Toast notifications1. **Run Setup Script**

- 📊 Real-time stock indicators   ```bash

   bash setup.sh

### 🛠️ **Admin Dashboard**   ```

- 📦 **Product Management** - CRUD with image upload

- 📁 **Category Management** - Organize products2. **Install dependencies**

- 📝 **Order Management** - View and update order status   ```bash

- ⭐ **Review Moderation** - Approve/reject reviews   npm install

- 🔥 **Best Seller Toggle** - Mark top products   cd backend && npm install && cd ..

- 👤 **Admin Profile** - Manage account settings   ```

- 📊 **Statistics Dashboard** - Business insights

- 🖼️ **Image Upload** - Direct device upload support3. **Start Development Servers**

- 🔐 **Secure Authentication** - JWT-based auth   ```bash

   npm run dev

### ⚡ **Performance Optimizations**   ```

- 🚀 **React Query Caching** - 80-90% faster navigation   This starts both frontend (port 8080) and backend (port 5000)

- 📦 **Code Splitting** - 20% smaller bundle (394KB vs 492KB)

- 🖼️ **Lazy Loading** - Progressive image loading### Available Scripts

- 💾 **Smart Caching** - Configurable cache durations

- ⚡ **Request Deduplication** - No redundant API calls```bash

- 🎯 **Optimized Chunks** - Admin panel loads separately (62KB)npm run start          # Full setup + start servers (recommended for first run)

npm run dev            # Start both frontend & backend

---npm run dev:frontend   # Start only frontend (Vite)

npm run dev:backend    # Start only backend (Express + MySQL)

## 🔧 Tech Stacknpm run build          # Build for production

npm run preview        # Preview production build

### **Frontend**   npm run dev

- ⚛️ **React 18** - Modern React with hooks   ```

- 📘 **TypeScript** - Type-safe development   Frontend runs on: http://localhost:8080

- ⚡ **Vite** - Lightning-fast build tool

- 🎨 **Tailwind CSS** - Utility-first styling### 🎯 Access Points

- 🎭 **shadcn/ui** - Beautiful component library- **Frontend:** http://localhost:8080

- 🔄 **React Query** - Data fetching and caching- **Backend API:** http://localhost:5000/api

- 🛣️ **React Router** - Client-side routing- **Admin Dashboard:** http://localhost:8080/admin

- 📱 **Responsive Design** - Mobile-first approach

## 📡 API Endpoints

### **Backend**

- 🟢 **Node.js** - JavaScript runtime### Products

- 🚂 **Express.js** - Web framework- `GET /api/products` - Get all products with filters

- 🗄️ **PostgreSQL** - Production database- `GET /api/products/:id` - Get single product

- 🔗 **Sequelize** - ORM for database- `GET /api/products/best-selling` - Get best-selling products

- 🔐 **JWT** - Authentication- `POST /api/products` - Create product (admin)

- 📧 **Nodemailer** - Email service- `PUT /api/products/:id` - Update product (admin)

- 🔒 **bcrypt** - Password hashing- `DELETE /api/products/:id` - Delete product (admin)

- `PATCH /api/products/:id/best-selling` - Toggle best-selling

### **Deployment**

- ☁️ **Vercel** - Frontend hosting### Categories

- 🚀 **Railway** - Backend & Database hosting- `GET /api/categories` - Get all categories

- 🌐 **GitHub** - Version control- `GET /api/categories/:slug` - Get category by slug

- 📦 **Git** - Source code management- `POST /api/categories` - Create category (admin)



---### Reviews

- `GET /api/reviews/product/:productId` - Get reviews for product

## ⚡ Performance- `POST /api/reviews` - Create review

- `GET /api/reviews` - Get all reviews (admin)

### **Before Optimization**- `PATCH /api/reviews/:id/approve` - Approve review (admin)

- 📦 Bundle: 492KB (150KB gzipped)- `DELETE /api/reviews/:id` - Delete review (admin)

- 🐢 Every page refetched data

- ⏱️ Navigation: 500-700ms## 🎨 Sample Data

- 📊 Lighthouse: ~65-70

The backend automatically seeds with 8 products (Creed, Dior, YSL, Tom Ford, etc.), 8 categories, and 8 reviews.

### **After Optimization**

- 📦 Bundle: 394KB (125KB gzipped) - **20% smaller!**## 🛠️ Tech Stack

- 🚀 Cached data loads instantly

- ⏱️ Navigation: 50-100ms - **80-90% faster!****Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Router  

- 📊 Lighthouse: 85+ - **Much better!****Backend:** Node.js, Express, MongoDB, Mongoose



### **Key Improvements**## 👨‍💻 Developer

```

✅ 20% smaller main bundleBuilt with ❤️ for Parfumeur Walid Clone

✅ 80-90% faster navigation with caching

✅ Code splitting (admin panel = separate 62KB chunk)

✅ Smart caching (products: 5min, categories: 30min)

✅ Lazy image loading---

✅ Beautiful loading skeletons

✅ Request deduplication## Installation

```

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

---

Follow these steps:

## 🚀 Quick Start

```sh

### **Prerequisites**# Step 1: Clone the repository using the project's Git URL.

```bashgit clone <YOUR_GIT_URL>

Node.js v18+

npm or yarn# Step 2: Navigate to the project directory.

PostgreSQL 14+ (for production)cd <YOUR_PROJECT_NAME>

```

# Step 3: Install the necessary dependencies.

### **1. Clone Repository**npm i

```bash

git clone https://github.com/soulaimane12bf/luxury-perfume-haven.git# Step 4: Start the development server with auto-reloading and an instant preview.

cd luxury-perfume-havennpm run dev

``````



### **2. Install Dependencies****Edit a file directly in GitHub**

```bash

npm install- Navigate to the desired file(s).

cd backend && npm install- Click the "Edit" button (pencil icon) at the top right of the file view.

cd ..- Make your changes and commit the changes.

```

**Use GitHub Codespaces**

### **3. Environment Configuration**

- Navigate to the main page of your repository.

**Frontend** - Create `.env` in root:- Click on the "Code" button (green button) near the top right.

```env- Select the "Codespaces" tab.

VITE_API_URL=http://localhost:5000- Click on "New codespace" to launch a new Codespace environment.

VITE_WHATSAPP_NUMBER=212XXXXXXXXX- Edit files directly within the Codespace and commit and push your changes once you're done.

```

## What technologies are used for this project?

**Backend** - Create `backend/.env`:

```envThis project is built with:

# Database

[REDACTED_DB_URL]

DB_NAME=perfume_db- TypeScript

DB_USER=your_user- React

DB_PASSWORD=your_password- shadcn-ui

DB_HOST=localhost- Tailwind CSS

DB_PORT=5432- Node.js / Express.js

- PostgreSQL (Neon)

# Auth- Vercel (Deployment)

JWT_SECRET=your-super-secret-jwt-key-min-32-chars

## How can I deploy this project?

# Email (Optional)

EMAIL_USER=your-email@gmail.comThis project is deployed on Vercel. To deploy:

EMAIL_PASS=your-app-password

```sh

# Adminvercel --prod

ADMIN_USERNAME=admin```

ADMIN_PASSWORD=admin123

```For detailed deployment instructions, see [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md)



### **4. Database Setup**
```bash
# Install PostgreSQL (if needed)
# Ubuntu/Debian:
sudo apt-get install postgresql

# macOS:
brew install postgresql

# Create database
psql -U postgres
CREATE DATABASE perfume_db;
\q
```

### **5. Start Development**
```bash
# Start both frontend and backend
npm run dev

# Or separately:
npm run dev:frontend  # http://localhost:8080
npm run dev:backend   # http://localhost:5000
```

### **6. Build for Production**
```bash
npm run build
```

**Frontend** → `dist/`  
**Backend** → Ready in `backend/`

---

## ⚙️ Configuration

### **Email Setup (Gmail)**

1. **Enable 2-Factor Authentication** in Gmail
2. **Generate App Password**:
   - Go to Google Account → Security
   - 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update backend/.env**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # 16-char app password
   ```

### **WhatsApp Integration**

1. **Get WhatsApp Number** (with country code)
2. **Update .env**:
   ```env
   VITE_WHATSAPP_NUMBER=212XXXXXXXXX  # Example: Morocco
   ```
3. **Features**:
   - Floating WhatsApp button
   - Direct order messages
   - Product inquiries
   - Customer support

### **Admin Account**

**Default Credentials**:
```
Username: admin
Password: admin123
```

**Change in backend/.env**:
```env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
```

---

## 🛠️ Admin Panel

Access at: `/admin`

### **Features**

#### **Products Management**
- ➕ Create new products
- ✏️ Edit existing products
- 🗑️ Delete products
- 🖼️ Upload images directly from device
- 🔥 Toggle best-selling status
- 📊 View stock levels

#### **Categories Management**
- 📁 Create categories (Men, Women, Unisex)
- ✏️ Edit category details
- 🗑️ Delete categories
- 🔗 Slug generation

#### **Orders Dashboard**
- 📦 View all orders
- 👁️ Expand to see full customer details
- ✅ Update order status
- 📧 Automatic email notifications
- 💬 WhatsApp integration

#### **Reviews Moderation**
- ⭐ View all reviews
- ✅ Approve reviews
- ❌ Reject/delete reviews
- 📊 Monitor ratings

#### **Profile Settings**
- 👤 Update admin profile
- 🔐 Change password
- 📧 Update email
- 🖼️ Profile picture

---

## 💬 WhatsApp Integration

### **How It Works**

1. **Floating Button** - Always visible on bottom-right
2. **Product Inquiries** - Send product details via WhatsApp
3. **Order Messages** - Automated order information
4. **Customer Support** - Direct communication channel

### **Message Format**

```
مرحبا، أريد طلب:
🛍️ المنتج: [Product Name]
💰 السعر: [Price] درهم
📦 الكمية: [Quantity]

معلومات العميل:
👤 الاسم: [Name]
📞 الهاتف: [Phone]
📍 العنوان: [Address]
```

### **Configuration**

Update in `.env`:
```env
VITE_WHATSAPP_NUMBER=212XXXXXXXXX
```

Example numbers:
- Morocco: `212XXXXXXXXX`
- UAE: `971XXXXXXXXX`
- Saudi: `966XXXXXXXXX`

---

## 📧 Email System

### **Automated Emails**

1. **Order Confirmation** - Sent when order is placed
2. **Order Status Updates** - Sent when status changes
3. **Admin Notifications** - New order alerts
4. **Review Notifications** - New review alerts

### **Email Templates**

Professional HTML templates with:
- ✨ Premium design
- 📱 Mobile responsive
- 🎨 Brand colors
- 📊 Order details
- 🔗 Tracking information

### **Setup Instructions**

See [Email Configuration](#configuration) section above.

### **Testing Email**

```bash
cd backend
node test-email.js
```

---

## 🚀 Deployment

### **Frontend (Vercel)**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import repository
   - Configure environment variables
   - Deploy!

3. **Environment Variables** (Vercel):
   ```
   VITE_API_URL=https://your-backend.railway.app
   VITE_WHATSAPP_NUMBER=212XXXXXXXXX
   ```

### **Backend (Railway)**

1. **Create Railway Project**:
   - Go to [railway.app](https://railway.app)
   - Create new project
   - Add PostgreSQL database

2. **Deploy Backend**:
   - Connect GitHub repository
   - Select `backend` folder as root
   - Add environment variables
   - Deploy!

3. **Environment Variables** (Railway):
   ```
   [REDACTED_DB_URL]
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-secure-password
   NODE_ENV=production
   ```

### **Database (Railway PostgreSQL)**

Railway automatically provisions PostgreSQL and provides `DATABASE_URL`.

### **Post-Deployment**

1. ✅ Test all features
2. ✅ Verify email sending
3. ✅ Test WhatsApp integration
4. ✅ Check admin panel
5. ✅ Monitor performance

---

## 📚 API Documentation

### **Base URL**
```
Development: http://localhost:5000
Production: https://your-backend.railway.app
```

### **Endpoints**

#### **Products**
```http
GET    /api/products           # Get all products (with filters)
GET    /api/products/:id       # Get single product
POST   /api/products           # Create product (admin)
PUT    /api/products/:id       # Update product (admin)
DELETE /api/products/:id       # Delete product (admin)
GET    /api/products/best-selling  # Get best sellers
POST   /api/products/:id/toggle-best-selling  # Toggle best seller
```

#### **Categories**
```http
GET    /api/categories         # Get all categories
GET    /api/categories/:slug   # Get category by slug
POST   /api/categories         # Create category (admin)
PUT    /api/categories/:id     # Update category (admin)
DELETE /api/categories/:id     # Delete category (admin)
```

#### **Orders**
```http
GET    /api/orders            # Get all orders (admin)
GET    /api/orders/:id        # Get single order
POST   /api/orders            # Create order
PUT    /api/orders/:id/status # Update order status (admin)
```

#### **Reviews**
```http
GET    /api/reviews                # Get all reviews
GET    /api/reviews/product/:id    # Get product reviews
POST   /api/reviews                # Create review
PUT    /api/reviews/:id/approve    # Approve review (admin)
DELETE /api/reviews/:id            # Delete review (admin)
```

#### **Auth**
```http
POST   /api/auth/login        # Admin login
GET    /api/auth/verify       # Verify JWT token
```

### **Query Parameters**

**Products Filtering**:
```
?category=men          # Filter by category
?brand=Dior           # Filter by brand
?type=PRODUIT         # Filter by type
?minPrice=100         # Minimum price
&maxPrice=500         # Maximum price
&best_selling=true    # Only best sellers
&sort=price_asc       # Sort order
&search=parfum        # Search query
```

---

## 📁 Project Structure

```
luxury-perfume-haven/
├── 📁 src/                    # Frontend source
│   ├── 📁 components/         # React components
│   │   ├── AdminNavbar.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── FloatingWhatsApp.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductCardSkeleton.tsx
│   │   └── ui/               # shadcn components
│   ├── 📁 pages/             # Route pages
│   │   ├── Index.tsx         # Homepage
│   │   ├── Collection.tsx    # Product listing
│   │   ├── ProductSingle.tsx # Product details
│   │   ├── BestSellers.tsx   # Best sellers
│   │   ├── AdminNew.tsx      # Admin panel
│   │   └── Login.tsx         # Admin login
│   ├── 📁 contexts/          # React contexts
│   │   ├── CartContext.tsx   # Shopping cart
│   │   └── ThemeContext.tsx  # Dark mode
│   ├── 📁 lib/               # Utilities
│   │   ├── api.ts           # API client
│   │   ├── queryClient.tsx  # React Query
│   │   ├── whatsapp.ts      # WhatsApp helper
│   │   └── hooks/
│   │       └── useApi.ts    # Custom hooks
│   └── App.tsx              # Main app
│
├── 📁 backend/               # Backend source
│   ├── 📁 src/
│   │   ├── 📁 controllers/   # Route handlers
│   │   ├── 📁 models/        # Database models
│   │   ├── 📁 routes/        # API routes
│   │   ├── 📁 middleware/    # Auth, validation
│   │   └── 📁 config/        # Database config
│   ├── server.js            # Express server
│   └── package.json
│
├── 📁 public/               # Static assets
├── 📁 dist/                 # Production build
├── .env                     # Frontend env
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md               # This file
```

---

## 🎯 Features Roadmap

### ✅ **Completed**
- [x] Full e-commerce functionality
- [x] Admin dashboard
- [x] WhatsApp integration
- [x] Email notifications
- [x] Performance optimizations
- [x] Responsive design
- [x] Shopping cart
- [x] Order management
- [x] Review system
- [x] Image upload
- [x] Authentication
- [x] Dark mode

### 🚧 **In Progress**
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced analytics

### 📋 **Planned**
- [ ] Customer accounts
- [ ] Wishlist feature
- [ ] Coupon system
- [ ] Loyalty rewards
- [ ] SMS notifications
- [ ] Advanced reporting
- [ ] Mobile app

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open Pull Request**

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Soulaimane**
- GitHub: [@soulaimane12bf](https://github.com/soulaimane12bf)

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Components
- [React Query](https://tanstack.com/query) - Data Fetching
- [Express.js](https://expressjs.com/) - Backend
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Vercel](https://vercel.com/) - Hosting
- [Railway](https://railway.app/) - Backend Hosting

---

## 📊 Stats

![GitHub Stars](https://img.shields.io/github/stars/soulaimane12bf/luxury-perfume-haven?style=social)
![GitHub Forks](https://img.shields.io/github/forks/soulaimane12bf/luxury-perfume-haven?style=social)
![GitHub Issues](https://img.shields.io/github/issues/soulaimane12bf/luxury-perfume-haven)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/soulaimane12bf/luxury-perfume-haven)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Soulaimane](https://github.com/soulaimane12bf)

</div>
