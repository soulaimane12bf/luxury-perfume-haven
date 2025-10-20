# 🚀 Quick Start Guide - Luxury Perfume Haven

## First Time Setup

If this is your **first time** running the project:

```bash
npm run start
```

This single command will:
1. ✅ Install MySQL Server
2. ✅ Configure database & create `perfume_haven` database  
3. ✅ Install all Node.js dependencies (frontend + backend)
4. ✅ Seed initial data (8 products, 8 categories, 8 reviews)
5. ✅ Create default admin user (username: `admin`, password: `admin123`)
6. ✅ Start both servers

**Wait time:** ~3-5 minutes (first run only)

---

## Subsequent Runs

After the first setup, you can use:

```bash
npm run dev
```

This starts both servers instantly (no setup needed).

---

## Access Points

Once running:

- **🌐 Frontend (Store):** http://localhost:8080
- **🔧 Backend API:** http://localhost:5000
- **👤 Admin Panel:** http://localhost:8080/admin
  - Username: `admin`
  - Password: `admin123`

---

## Individual Server Commands

If you need to run servers separately:

```bash
# Frontend only (port 8080)
npm run dev:frontend

# Backend only (port 5000)
npm run dev:backend
```

---

## Troubleshooting

### Port Already in Use

If you see `EADDRINUSE` error:

```bash
# Kill processes on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill processes on port 8080 (frontend)
lsof -ti:8080 | xargs kill -9
```

### MySQL Not Running

```bash
# Start MySQL service
sudo service mysql start

# Check status
sudo service mysql status
```

### Reset Database

```bash
# Re-run setup script
bash setup.sh
```

---

## Features Overview

✅ **Shopping Cart** - Add products, view cart, checkout via WhatsApp  
✅ **Search** - Real-time product search by name, brand, category  
✅ **Dark Mode** - Toggle in header navbar  
✅ **Admin Panel** - Full CRUD for products, categories, reviews  
✅ **Responsive Design** - Mobile, tablet, desktop optimized  
✅ **WhatsApp Checkout** - Direct order via WhatsApp message  
✅ **Product Reviews** - Customer ratings with approval system  
✅ **Best Sellers** - Highlight top products  
✅ **Advanced Filters** - Price, brand, category, type filters

---

## Need Help?

Check these files:
- `README.md` - Full documentation
- `QUICKSTART.md` - Detailed setup guide
- `ADMIN_PANEL_GUIDE.md` - Admin features
- `WHATSAPP_SETUP.md` - WhatsApp configuration
- `LATEST_FEATURES.md` - Recent features

---

**Happy coding! 🎉**
