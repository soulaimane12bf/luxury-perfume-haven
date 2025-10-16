# 🎯 NPM START COMMAND - Complete Guide

## What is `npm run start`?

A **one-command setup** that handles everything from installation to running servers.

---

## Usage

### First Time Running the Project

```bash
npm run start
```

### What It Does (Step by Step)

```
1. 🎨 Shows welcome banner
2. 🔧 Installs MySQL Server (if not installed)
3. 🚀 Starts MySQL service
4. 🔐 Configures MySQL root user
5. 💾 Creates 'perfume_haven' database
6. 📦 Installs Node.js dependencies (root)
7. 📦 Installs backend dependencies
8. 🌱 Seeds database with:
   - 8 sample products
   - 8 categories
   - 8 reviews
   - 1 admin user (admin/admin123)
9. ✅ Starts frontend server (port 8080)
10. ✅ Starts backend server (port 5000)
```

**Total Time:** ~3-5 minutes (first run only)

---

## Subsequent Runs

After first setup, use the faster command:

```bash
npm run dev
```

This skips the setup and goes straight to starting servers.

---

## Available Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run start` | Full setup + start servers | First time or after reset |
| `npm run dev` | Start both servers | Daily development |
| `npm run dev:frontend` | Frontend only | Backend already running |
| `npm run dev:backend` | Backend only | Frontend already running |
| `npm run build` | Production build | Deployment |
| `npm run preview` | Preview production build | Testing before deploy |

---

## Visual Flow

```
npm run start
     ↓
[Show Banner] → [Run setup.sh] → [Start Servers]
     ↓                 ↓                 ↓
  Welcome         Install MySQL      Frontend :8080
   Message        Create DB          Backend  :5000
  (3 seconds)     Seed Data
                  Install deps
                  (3-5 minutes)
```

---

## What Gets Installed

### System Packages
- MySQL Server 8.0
- MySQL Client

### Node Dependencies

**Frontend:**
- React 18
- TypeScript
- Vite
- TanStack Query
- React Router v6
- Tailwind CSS
- Shadcn UI Components
- Lucide Icons

**Backend:**
- Express.js
- Sequelize ORM
- MySQL2 Driver
- bcrypt
- jsonwebtoken
- cors

---

## Default Credentials

### Admin Panel
- **URL:** http://localhost:8080/admin
- **Username:** `admin`
- **Password:** `admin123`

### Database
- **Host:** localhost
- **Port:** 3306
- **User:** root
- **Password:** (empty)
- **Database:** perfume_haven

---

## After Running

You'll see this output:

```
✅ MySQL installed
✅ MySQL service started
✅ Root user configured
✅ Database 'perfume_haven' created
✅ Dependencies installed
✅ Database seeded
✅ Admin user created

🚀 Servers running:
   Frontend: http://localhost:8080
   Backend:  http://localhost:5000

Press Ctrl+C to stop servers
```

---

## Troubleshooting

### "Setup script failed"
```bash
# Check MySQL status
sudo service mysql status

# Restart MySQL
sudo service mysql restart

# Re-run setup
bash setup.sh
```

### "Port already in use"
```bash
# Kill existing processes
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:8080 | xargs kill -9  # Frontend

# Try again
npm run dev
```

### "Dependencies not found"
```bash
# Clear and reinstall
rm -rf node_modules backend/node_modules
npm install
cd backend && npm install
```

### "Database connection failed"
```bash
# Check MySQL is running
sudo service mysql status

# Check database exists
mysql -u root -e "SHOW DATABASES;"

# Should see 'perfume_haven' in list
```

---

## Skip Setup (Already Configured)

If MySQL and database are already set up:

```bash
npm run dev
```

This is **much faster** (starts in ~5 seconds).

---

## Environment Variables

The app uses these defaults (no `.env` needed):

```
# Frontend
VITE_API_URL=/api

# Backend
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=perfume_haven
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
```

To customize, create `.env` files in root and backend folders.

---

## Project Structure After Setup

```
luxury-perfume-haven/
├── node_modules/           ✅ Installed
├── backend/
│   ├── node_modules/       ✅ Installed
│   ├── src/
│   └── package.json
├── src/
├── public/
├── setup.sh                ✅ Executed
├── start-banner.sh         ✅ Executed
├── package.json
└── START.md               👈 You are here
```

---

## Production Deployment

For production, **don't use** `npm run start`. Instead:

```bash
# Build frontend
npm run build

# Start backend in production mode
cd backend
NODE_ENV=production node src/app.js
```

---

## Key Features Available

After running `npm run start`, you can:

✅ Browse products at http://localhost:8080  
✅ Search products (header search icon)  
✅ Add to cart & checkout via WhatsApp  
✅ Toggle dark mode (moon icon in header)  
✅ View product details  
✅ Submit reviews  
✅ Login to admin at /admin  
✅ Manage products, categories, reviews  
✅ Mark products as best sellers  
✅ Filter products by brand, price, category  

---

## Need More Help?

📚 **Documentation Files:**
- `README.md` - Main documentation
- `QUICKSTART.md` - Detailed setup guide
- `ADMIN_PANEL_GUIDE.md` - Admin features
- `WHATSAPP_SETUP.md` - WhatsApp integration
- `LATEST_FEATURES.md` - New features
- `START.md` - This file

---

**Made with ❤️ for Luxury Perfume Haven**

🌐 Frontend: React + TypeScript + Vite  
⚙️ Backend: Express + MySQL + Sequelize  
🎨 UI: Tailwind + Shadcn  
