# 🌟 Cosmed Stores - متجر كوسمد للعطور الأصلية

<div align="center">

![Cosmed Stores](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Cosmed Stores - Full-stack luxury perfume e-commerce platform with advanced features, admin panel, and performance optimizations**

[Live Site](https://www.cosmedstores.com) • [Report Bug](https://github.com/soulaimane12bf/luxury-perfume-haven/issues) • [Request Feature](https://github.com/soulaimane12bf/luxury-perfume-haven/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Performance](#-performance)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Admin Panel](#-admin-panel)
- [WhatsApp Integration](#-whatsapp-integration)
- [Email System](#-email-system)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)

---

## ✨ Features

### 🛍️ **E-commerce Features**
- 🎨 **Premium UI/UX** - Beautiful gradient designs with animations
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🛒 **Shopping Cart** - Add to cart with quantity management
- 🔍 **Advanced Search** - Real-time product search
- 🎯 **Smart Filtering** - Filter by brand, price, type, category
- ⭐ **Product Reviews** - Customer ratings with approval system
- 🔥 **Best Sellers** - Dedicated section for top products
- 📦 **Order Management** - Complete order tracking system
- 💬 **WhatsApp Integration** - Direct customer communication
- 📧 **Email Notifications** - Automated order confirmations

### �� **User Interface**
- ✨ Gradient backgrounds with gold accents
- 🌙 Dark mode support
- 🎭 Smooth animations and transitions
- 💎 Premium loading skeletons
- 📸 Image galleries with zoom
- 🎪 Floating WhatsApp button
- 🔔 Toast notifications
- 📊 Real-time stock indicators

### 🛠️ **Admin Dashboard**
- 📦 **Product Management** - CRUD with image upload from device
- 📁 **Category Management** - Organize products
- 📝 **Order Management** - View and update order status
- ⭐ **Review Moderation** - Approve/reject reviews
- 🔥 **Best Seller Toggle** - Mark top products
- 👤 **Admin Profile** - Manage account settings
- 📊 **Statistics Dashboard** - Business insights
- 🔐 **Secure Authentication** - JWT-based auth

### ⚡ **Performance Optimizations**
- 🚀 **React Query Caching** - 80-90% faster navigation
- 📦 **Code Splitting** - 20% smaller bundle (394KB vs 492KB)
- 🖼️ **Lazy Loading** - Progressive image loading
- 💾 **Smart Caching** - Configurable cache durations
- ⚡ **Request Deduplication** - No redundant API calls

---

## 🔧 Tech Stack

### Frontend
⚛️ React 18 • 📘 TypeScript • ⚡ Vite • 🎨 Tailwind CSS • 🎭 shadcn/ui • 🔄 React Query • 🛣️ React Router

### Backend
🟢 Node.js • 🚂 Express.js • 🗄️ PostgreSQL • 🔗 Sequelize • 🔐 JWT • 📧 Nodemailer

### Deployment
☁️ Vercel (Frontend) • 🚀 Railway (Backend & Database)

---

## ⚡ Performance

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Bundle Size** | 492KB | 394KB | ✅ 20% smaller |
| **Gzipped** | 150KB | 125KB | ✅ 17% smaller |
| **Navigation** | 500-700ms | 50-100ms | ✅ 80-90% faster |
| **Lighthouse** | ~65-70 | 85+ | ✅ Much better |

---

## 🚀 Quick Start

### 1. Clone & Install
\`\`\`bash
git clone https://github.com/soulaimane12bf/luxury-perfume-haven.git
cd luxury-perfume-haven
npm install
cd backend && npm install && cd ..
\`\`\`

### 2. Environment Setup

**Frontend `.env`:**
\`\`\`env
VITE_API_URL=http://localhost:5000
VITE_WHATSAPP_NUMBER=212XXXXXXXXX
\`\`\`

**Backend `backend/.env`:**
\`\`\`env
[REDACTED_DB_URL]
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
\`\`\`

### 3. Start Development
\`\`\`bash
npm run dev  # Starts frontend (8080) + backend (5000)
\`\`\`

### 4. Build for Production
\`\`\`bash
npm run build
\`\`\`

---

## ⚙️ Configuration

### Email Setup (Gmail)
1. Enable 2FA in Gmail
2. Generate App Password (Security → 2-Step Verification → App passwords)
3. Add to `backend/.env`:
   \`\`\`env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   \`\`\`

### WhatsApp Integration
1. Update `.env` with country code:
   \`\`\`env
   VITE_WHATSAPP_NUMBER=212XXXXXXXXX  # Morocco example
   \`\`\`
2. Features: Floating button, order messages, product inquiries

### Admin Account
**Default:** `admin` / `admin123`

Change in `backend/.env`:
\`\`\`env
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_secure_password
\`\`\`

---

## 🛠️ Admin Panel

Access at `/admin`

### Features
- ➕ **Products**: Create/edit/delete with device image upload
- 📁 **Categories**: Organize products (Men, Women, Unisex)
- �� **Orders**: View all orders, expand for details, update status
- ⭐ **Reviews**: Approve/reject customer reviews
- 🔥 **Best Sellers**: Toggle best-selling products
- 👤 **Profile**: Update admin settings

---

## 💬 WhatsApp Integration

### How It Works
- **Floating Button** - Always visible bottom-right
- **Product Inquiries** - Send product details directly
- **Order Messages** - Automated order information
- **Customer Support** - Direct communication

### Message Format
\`\`\`
مرحبا، أريد طلب:
🛍️ المنتج: [Product Name]
💰 السعر: [Price] درهم
📦 الكمية: [Quantity]

معلومات العميل:
👤 الاسم: [Name]
📞 الهاتف: [Phone]
📍 العنوان: [Address]
\`\`\`

---

## 📧 Email System

### Automated Emails
1. **Order Confirmation** - When order is placed
2. **Order Status Updates** - When status changes
3. **Admin Notifications** - New order alerts
4. **Review Notifications** - New review alerts

### Professional HTML Templates
✨ Premium design • 📱 Mobile responsive • 🎨 Brand colors • 📊 Order details

### Test Email
\`\`\`bash
cd backend && node test-email.js
\`\`\`

---

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add environment variables:
   \`\`\`
   VITE_API_URL=https://your-backend.railway.app
   VITE_WHATSAPP_NUMBER=212XXXXXXXXX
   \`\`\`
4. Deploy!

### Backend (Railway)
1. Create project on [railway.app](https://railway.app)
2. Add PostgreSQL database
3. Connect GitHub repo
4. Add environment variables:
   \`\`\`
   [REDACTED_DB_URL]
   JWT_SECRET=your-secret
   EMAIL_USER=your-email
   EMAIL_PASS=your-password
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=secure-password
   NODE_ENV=production
   \`\`\`
5. Deploy!

---

## 📚 API Documentation

### Base URL
\`\`\`
Development: http://localhost:5000
Production: https://your-backend.railway.app
\`\`\`

### Endpoints

**Products**
\`\`\`
GET    /api/products           # Get all (with filters)
GET    /api/products/:id       # Get single
POST   /api/products           # Create (admin)
PUT    /api/products/:id       # Update (admin)
DELETE /api/products/:id       # Delete (admin)
GET    /api/products/best-selling
\`\`\`

**Categories**
\`\`\`
GET    /api/categories
GET    /api/categories/:slug
POST   /api/categories         # Create (admin)
PUT    /api/categories/:id     # Update (admin)
\`\`\`

**Orders**
\`\`\`
GET    /api/orders             # Get all (admin)
POST   /api/orders             # Create
PUT    /api/orders/:id/status  # Update (admin)
\`\`\`

**Reviews**
\`\`\`
GET    /api/reviews
GET    /api/reviews/product/:id
POST   /api/reviews
PUT    /api/reviews/:id/approve  # Approve (admin)
DELETE /api/reviews/:id          # Delete (admin)
\`\`\`

**Auth**
\`\`\`
POST   /api/auth/login
GET    /api/auth/verify
\`\`\`

### Query Parameters
\`\`\`
?category=men&brand=Dior&type=PRODUIT
&minPrice=100&maxPrice=500&best_selling=true
&sort=price_asc&search=parfum
\`\`\`

---

## 📁 Project Structure

\`\`\`
luxury-perfume-haven/
├── src/                    # Frontend
│   ├── components/         # React components
│   ├── pages/             # Route pages
│   ├── contexts/          # React contexts
│   ├── lib/               # API, hooks, utils
│   └── App.tsx
├── backend/               # Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── server.js
├── docs/                  # Documentation archive
└── README.md             # This file
\`\`\`

---

## 🎯 Roadmap

### ✅ Completed
- [x] E-commerce functionality
- [x] Admin dashboard
- [x] WhatsApp integration
- [x] Email system
- [x] Performance optimizations
- [x] Responsive design

### 📋 Planned
- [ ] Payment gateway
- [ ] Multi-language
- [ ] Customer accounts
- [ ] Wishlist
- [ ] Coupon system

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit: `git commit -m 'Add AmazingFeature'`
4. Push: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 👨‍💻 Author

**Soulaimane** - [@soulaimane12bf](https://github.com/soulaimane12bf)

---

## 🙏 Acknowledgments

[React](https://react.dev/) • [Vite](https://vitejs.dev/) • [Tailwind CSS](https://tailwindcss.com/) • [shadcn/ui](https://ui.shadcn.com/) • [React Query](https://tanstack.com/query) • [Express.js](https://expressjs.com/) • [PostgreSQL](https://www.postgresql.org/) • [Vercel](https://vercel.com/) • [Railway](https://railway.app/)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Soulaimane](https://github.com/soulaimane12bf)

</div>
