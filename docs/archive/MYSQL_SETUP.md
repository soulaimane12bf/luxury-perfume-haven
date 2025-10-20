# MySQL Setup Guide for GitHub Codespaces

This guide will help you set up MySQL in a fresh GitHub Codespace for the Luxury Perfume Haven project.

## 🚀 Quick Setup (5 minutes)

### Step 1: Install MySQL Server

```bash
# Update package list
sudo apt-get update

# Install MySQL server
sudo apt-get install -y mysql-server

# Start MySQL service
sudo service mysql start
```

### Step 2: Configure MySQL Root User

MySQL in Codespaces uses `auth_socket` authentication by default, which needs to be changed:

```bash
# Login to MySQL as root
sudo mysql

# Then run these SQL commands:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EXIT;
```

**Note**: We're using an empty password (`''`) for development. For production, use a strong password!

### Step 3: Create Database

```bash
# Create the perfume_haven database
sudo mysql -e "CREATE DATABASE perfume_haven;"

# Verify it was created
sudo mysql -e "SHOW DATABASES;"
```

You should see `perfume_haven` in the list!

### Step 4: Install Backend Dependencies

```bash
# Navigate to backend directory
cd /workspaces/luxury-perfume-haven/backend

# Install Node.js dependencies
npm install
```

### Step 5: Configure Environment Variables

The `.env` file should already exist in the `backend` folder. Verify it has these settings:

```bash
# View the .env file
cat backend/.env
```

It should contain:
```env
# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=perfume_haven

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:8080
```

### Step 6: Start the Backend

```bash
# From the backend directory
npm start
```

You should see:
```
✅ Connected to MySQL
✅ Database tables synchronized
📦 Seeding database...
   ✓ Inserted 8 products
   ✓ Inserted 8 categories
   ✓ Inserted 8 reviews
   ✓ Created default admin (username: admin, password: admin123)
✅ Database ready
🚀 Server running on http://localhost:5000
```

### Step 7: Start the Frontend

Open a **new terminal** and run:

```bash
# From the root directory
cd /workspaces/luxury-perfume-haven

# Install frontend dependencies (if needed)
npm install

# Start the dev server
npm run dev
```

The frontend will be available on port 8080.

---

## 📦 Required Packages

### System Packages (APT)
- `mysql-server` - MySQL database server

### Backend Node Packages (already in package.json)
- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `sequelize` - ORM for MySQL
- `mysql2` - MySQL client for Node.js
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

### Frontend Node Packages (already in package.json)
All dependencies are already defined in the root `package.json`.

---

## 🔧 Troubleshooting

### Issue: "Can't connect to MySQL server"

**Solution**: Make sure MySQL service is running:
```bash
sudo service mysql start
sudo service mysql status
```

### Issue: "Access denied for user 'root'@'localhost'"

**Solution**: Reset root password:
```bash
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
EXIT;
```

### Issue: "Database 'perfume_haven' doesn't exist"

**Solution**: Create the database:
```bash
sudo mysql -e "CREATE DATABASE perfume_haven;"
```

### Issue: Port 5000 or 8080 already in use

**Solution**: Kill the process using the port:
```bash
# For backend (port 5000)
lsof -ti:5000 | xargs kill -9

# For frontend (port 8080)
lsof -ti:8080 | xargs kill -9
```

### Issue: Backend crashes with "force: true"

The backend uses `sequelize.sync({ force: true })` which **drops and recreates tables** every time. This is useful during development but you may want to change it to `{ alter: true }` after the schema is stable.

**To change**: Edit `backend/src/app.js` line 42:
```javascript
// Change from:
await sequelize.sync({ force: true });

// To:
await sequelize.sync({ alter: true });
```

---

## 🎯 One-Line Setup Script

Create a setup script to automate everything:

```bash
# Create setup.sh
cat > setup.sh << 'EOF'
#!/bin/bash
echo "🚀 Setting up Luxury Perfume Haven..."

# Install MySQL
echo "📦 Installing MySQL..."
sudo apt-get update -qq
sudo apt-get install -y mysql-server > /dev/null 2>&1

# Start MySQL
echo "🔧 Starting MySQL service..."
sudo service mysql start

# Configure MySQL
echo "🔐 Configuring MySQL root user..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; FLUSH PRIVILEGES;"

# Create database
echo "💾 Creating database..."
sudo mysql -e "DROP DATABASE IF EXISTS perfume_haven; CREATE DATABASE perfume_haven;"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install > /dev/null 2>&1

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd .. && npm install > /dev/null 2>&1

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Start backend:  cd backend && npm start"
echo "   2. Start frontend: npm run dev"
echo "   3. Login with:     admin / admin123"
echo ""
echo "📖 Read MYSQL_SETUP.md for more details"
EOF

# Make it executable
chmod +x setup.sh

# Run it
./setup.sh
```

---

## 📝 Default Credentials

### Admin Login
- **Username**: `admin`
- **Email**: `admin@parfumeurwalid.com`
- **Password**: `admin123`
- **Role**: `super-admin`

### MySQL
- **Host**: `localhost`
- **User**: `root`
- **Password**: (empty string)
- **Database**: `perfume_haven`
- **Port**: `3306` (default)

---

## 🔄 Database Schema

The backend automatically creates these tables:

1. **products** - Product catalog
2. **categories** - Product categories
3. **reviews** - Customer reviews
4. **admins** - Admin users

Schema is defined in `backend/src/models/` using Sequelize.

---

## 🌍 Port Forwarding in Codespaces

GitHub Codespaces automatically forwards ports. You can access your app via:

1. **Ports Panel**: Click the "PORTS" tab at the bottom of VS Code
2. **Port 8080**: Your frontend (public URL will be shown)
3. **Port 5000**: Your backend (usually private)

The frontend uses a **Vite proxy** to forward `/api` requests to `localhost:5000`, so you don't need to expose the backend port publicly.

---

## ✨ Tips for Fresh Codespace

1. **Always start MySQL first**: `sudo service mysql start`
2. **Check if MySQL is running**: `sudo service mysql status`
3. **View logs**: Backend logs errors to console
4. **Reset database**: Just restart the backend (it drops and recreates tables)
5. **Keep servers running**: Use `&` to run in background or open multiple terminals

---

## 🐳 Alternative: Using Docker (Advanced)

If you prefer Docker instead of installing MySQL directly:

```bash
# Pull MySQL image
docker pull mysql:8.0

# Run MySQL container
docker run -d \
  --name perfume-mysql \
  -e MYSQL_ROOT_PASSWORD="" \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -e MYSQL_DATABASE=perfume_haven \
  -p 3306:3306 \
  mysql:8.0

# Backend .env remains the same
```

---

## 📚 Additional Resources

- [Sequelize Documentation](https://sequelize.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)

---

## 🎉 You're All Set!

After following these steps, your Codespace will have:
- ✅ MySQL server running
- ✅ Database created and seeded
- ✅ Backend API on port 5000
- ✅ Frontend app on port 8080
- ✅ Admin panel accessible at `/admin`

Happy coding! 🚀
