@echo off
echo ==========================================
echo 🚀 Luxury Perfume Haven - Windows Setup
echo ==========================================

REM Check if MySQL is accessible through XAMPP
echo 📋 Checking MySQL connection...
"C:\xampp\mysql\bin\mysql.exe" --user=root --execute="SELECT 1;" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Error: Cannot connect to MySQL. Please make sure XAMPP MySQL service is running!
    echo Please start MySQL in XAMPP Control Panel and try again.
    pause
    exit /b 1
)

REM Create database if it doesn't exist
echo 💾 Creating database 'perfume_haven'...
"C:\xampp\mysql\bin\mysql.exe" --user=root --execute="CREATE DATABASE IF NOT EXISTS perfume_haven;"
echo ✓ Database created successfully

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

REM Seed the database
echo 🌱 Seeding initial data...
cd backend
echo Note: The backend seeds the database automatically when it starts.
echo To seed now, start the backend with: cd backend && npm start

echo ✅ Setup completed successfully!
echo.
echo 🚀 To start the application:
echo    1. Make sure XAMPP MySQL is running
echo    2. Run 'npm run dev' for frontend
echo    3. Run 'cd backend && npm start' for backend
echo.
pause