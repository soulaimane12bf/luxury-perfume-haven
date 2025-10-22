#!/bin/bash

# Configuration
API_URL="https://luxury-perfume-haven.vercel.app/api"
USERNAME="admin"
PASSWORD="admintest"

echo "🔄 Step 1: Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

echo "Login Response: $LOGIN_RESPONSE"

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Trying to extract error..."
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful! Token obtained."
echo ""

echo "🌱 Step 2: Seeding products..."
SEED_RESPONSE=$(curl -s -X POST "$API_URL/seed/seed" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo ""
echo "📊 Seed Response:"
echo "$SEED_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SEED_RESPONSE"

echo ""
echo "✅ Seeding complete!"
