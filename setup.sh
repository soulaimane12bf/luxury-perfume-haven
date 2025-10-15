#!/bin/bash

# Luxury Perfume Haven - Automated Setup Script for GitHub Codespaces
# This script installs MySQL, configures it, and sets up the project

set -e  # Exit on error

echo "🚀 Luxury Perfume Haven - Automated Setup"
echo "=========================================="
echo ""

# Check if running in Codespace
if [ -z "$CODESPACE_NAME" ]; then
    echo "⚠️  Warning: This script is designed for GitHub Codespaces"
    echo "It may work on Ubuntu/Debian systems, but is not tested elsewhere."
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Install MySQL
echo "📦 Step 1/7: Installing MySQL Server..."
sudo apt-get update -qq > /dev/null 2>&1
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server > /dev/null 2>&1
echo "   ✓ MySQL installed"

# Step 2: Start MySQL service
echo "🔧 Step 2/7: Starting MySQL service..."
sudo service mysql start > /dev/null 2>&1
sleep 2

# Check if MySQL is running
if sudo service mysql status > /dev/null 2>&1; then
    echo "   ✓ MySQL service started"
else
    echo "   ✗ Failed to start MySQL"
    exit 1
fi

# Step 3: Configure MySQL root user
echo "🔐 Step 3/7: Configuring MySQL authentication..."
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';" > /dev/null 2>&1
sudo mysql -e "FLUSH PRIVILEGES;" > /dev/null 2>&1
echo "   ✓ Root user configured (password: empty)"

# Step 4: Create database
echo "💾 Step 4/7: Creating database 'perfume_haven'..."
sudo mysql -e "DROP DATABASE IF EXISTS perfume_haven;" > /dev/null 2>&1
sudo mysql -e "CREATE DATABASE perfume_haven;" > /dev/null 2>&1
echo "   ✓ Database created"

# Step 5: Install backend dependencies
echo "📦 Step 5/7: Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install --silent > /dev/null 2>&1
    echo "   ✓ Backend dependencies installed"
else
    echo "   ✓ Backend dependencies already installed"
fi
cd ..

# Step 6: Install frontend dependencies
echo "📦 Step 6/7: Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
    npm install --silent > /dev/null 2>&1
    echo "   ✓ Frontend dependencies installed"
else
    echo "   ✓ Frontend dependencies already installed"
fi

# Step 7: Verify setup
echo "✅ Step 7/7: Verifying setup..."
echo ""

# Check MySQL connection (try with and without sudo)
if mysql -u root -e "USE perfume_haven;" > /dev/null 2>&1; then
    echo "   ✓ MySQL connection: OK"
elif sudo mysql -u root -e "USE perfume_haven;" > /dev/null 2>&1; then
    echo "   ✓ MySQL connection: OK (requires sudo)"
    echo "   ⚠️  Note: You may need to run 'sudo mysql' to access MySQL"
else
    echo "   ✗ MySQL connection: FAILED"
    echo "   Trying to diagnose the issue..."
    sudo mysql -e "SELECT User, Host, plugin FROM mysql.user WHERE User='root';" 2>&1 | head -10
    exit 1
fi

# Check backend .env
if [ -f "backend/.env" ]; then
    echo "   ✓ Backend .env: EXISTS"
else
    echo "   ✗ Backend .env: MISSING"
    echo "     Creating default .env file..."
    cat > backend/.env << 'ENVEOF'
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
ENVEOF
    echo "   ✓ Created backend/.env"
fi

# Check frontend .env
if [ -f ".env" ]; then
    echo "   ✓ Frontend .env: EXISTS"
else
    echo "   ! Frontend .env: MISSING (creating...)"
    echo "VITE_API_URL=/api" > .env
    echo "   ✓ Created .env"
fi

echo ""
echo "=========================================="
echo "✨ Setup Complete! ✨"
echo "=========================================="
echo ""
echo "📊 Configuration Summary:"
echo "   • MySQL Host:     localhost"
echo "   • MySQL User:     root"
echo "   • MySQL Password: (empty)"
echo "   • Database:       perfume_haven"
echo "   • Backend Port:   5000"
echo "   • Frontend Port:  8080"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "   1️⃣  Start the Backend:"
echo "      cd backend && npm start"
echo ""
echo "   2️⃣  Start the Frontend (in new terminal):"
echo "      npm run dev"
echo ""
echo "   3️⃣  Access the Application:"
echo "      • Frontend: http://localhost:8080"
echo "      • Admin:    http://localhost:8080/admin"
echo "      • Login:    admin / admin123"
echo ""
echo "📖 Documentation:"
echo "   • MYSQL_SETUP.md - Detailed MySQL setup guide"
echo "   • ADMIN_PANEL_GUIDE.md - Admin panel usage"
echo "   • README.md - Project overview"
echo ""
echo "🐛 Troubleshooting:"
echo "   • MySQL not running: sudo service mysql start"
echo "   • Reset database: sudo mysql -e 'DROP DATABASE perfume_haven; CREATE DATABASE perfume_haven;'"
echo "   • View this script: cat setup.sh"
echo ""
echo "Happy coding! 🚀"
