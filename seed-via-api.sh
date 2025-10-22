#!/bin/bash

echo "🔐 Please enter admin credentials:"
read -p "Username: " USERNAME
read -sp "Password: " PASSWORD
echo ""

echo "🔄 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST https://luxury-perfume-haven.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Please check your credentials."
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful!"
echo ""
echo "🌱 Seeding products (20 per category)..."

SEED_RESPONSE=$(curl -s -X POST https://luxury-perfume-haven.vercel.app/api/seed/seed \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$SEED_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SEED_RESPONSE"

echo ""
echo "✅ Done!"
