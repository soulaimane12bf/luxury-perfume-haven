#!/bin/bash

# Email & WhatsApp Configuration Helper Script
echo "=============================================="
echo "📧 Email & WhatsApp Notifications Setup"
echo "=============================================="
echo ""

# Get current .env values
ENV_FILE="/workspaces/luxury-perfume-haven/backend/.env"

echo "This script will help you configure email notifications."
echo ""
echo "⚠️  IMPORTANT: For Gmail, you need:"
echo "   1. Enable 2-Factor Authentication"
echo "   2. Generate an App Password (NOT your regular password)"
echo "   3. Guide: https://support.google.com/accounts/answer/185833"
echo ""
echo "Press ENTER to continue or Ctrl+C to cancel..."
read

echo ""
echo "📧 Step 1: Email Configuration"
echo "================================"
echo ""

# Get email user
echo -n "Enter your Gmail address (e.g., yourname@gmail.com): "
read EMAIL_USER

# Get email password
echo -n "Enter your Gmail App Password (16 characters): "
read -s EMAIL_PASS
echo ""

# Get admin email
echo -n "Enter email to receive notifications (press ENTER to use same as above): "
read ADMIN_EMAIL
if [ -z "$ADMIN_EMAIL" ]; then
  ADMIN_EMAIL=$EMAIL_USER
fi

echo ""
echo "📱 Step 2: WhatsApp Configuration"
echo "=================================="
echo ""
echo "Enter your WhatsApp number:"
echo "Format: country code + number (no + or spaces)"
echo "Examples: 212612345678 (Morocco), 15551234567 (USA)"
echo ""
echo -n "WhatsApp Number: "
read ADMIN_WHATSAPP

# Validate inputs
if [ -z "$EMAIL_USER" ] || [ -z "$EMAIL_PASS" ]; then
  echo ""
  echo "❌ Error: Email and password are required!"
  exit 1
fi

# Update .env file
echo ""
echo "📝 Updating configuration..."

# Create backup
cp $ENV_FILE "$ENV_FILE.backup"

# Update or add email settings
if grep -q "EMAIL_USER=" $ENV_FILE; then
  sed -i "s|EMAIL_USER=.*|EMAIL_USER=$EMAIL_USER|" $ENV_FILE
else
  echo "EMAIL_USER=$EMAIL_USER" >> $ENV_FILE
fi

if grep -q "EMAIL_PASS=" $ENV_FILE; then
  sed -i "s|EMAIL_PASS=.*|EMAIL_PASS=$EMAIL_PASS|" $ENV_FILE
else
  echo "EMAIL_PASS=$EMAIL_PASS" >> $ENV_FILE
fi

if grep -q "ADMIN_EMAIL=" $ENV_FILE; then
  sed -i "s|ADMIN_EMAIL=.*|ADMIN_EMAIL=$ADMIN_EMAIL|" $ENV_FILE
else
  echo "ADMIN_EMAIL=$ADMIN_EMAIL" >> $ENV_FILE
fi

if grep -q "ADMIN_WHATSAPP=" $ENV_FILE; then
  sed -i "s|ADMIN_WHATSAPP=.*|ADMIN_WHATSAPP=$ADMIN_WHATSAPP|" $ENV_FILE
else
  echo "ADMIN_WHATSAPP=$ADMIN_WHATSAPP" >> $ENV_FILE
fi

echo ""
echo "✅ Configuration saved!"
echo ""
echo "📋 Summary:"
echo "  Email User: $EMAIL_USER"
echo "  Email Pass: ${EMAIL_PASS:0:4}**** (hidden)"
echo "  Admin Email: $ADMIN_EMAIL"
echo "  WhatsApp: $ADMIN_WHATSAPP"
echo ""

# Restart backend
echo "🔄 Restarting backend server..."
pkill -f "node src/app.js"
sleep 2
cd /workspaces/luxury-perfume-haven/backend && node src/app.js > backend.log 2>&1 &
sleep 3

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "  1. Place a test order from your website"
echo "  2. Check your email inbox (and spam folder)"
echo "  3. Check backend logs for WhatsApp URL:"
echo "     tail -f /workspaces/luxury-perfume-haven/backend/backend.log"
echo ""
echo "❓ Need help? See EMAIL_SETUP_GUIDE.md"
echo ""
