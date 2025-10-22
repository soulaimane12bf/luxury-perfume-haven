#!/bin/bash

# Script to delete all sliders via API

API_URL="https://luxury-perfume-haven.vercel.app/api"

echo "🔐 Please enter your admin credentials:"
read -p "Username: " username
read -sp "Password: " password
echo ""

# Login to get token
echo "🔄 Logging in..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$username\",\"password\":\"$password\"}" | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed! Check your credentials."
  exit 1
fi

echo "✅ Logged in successfully!"

# Get all sliders
echo "🔄 Fetching sliders..."
SLIDERS=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/sliders")
SLIDER_IDS=$(echo $SLIDERS | jq -r '.[].id')

if [ -z "$SLIDER_IDS" ]; then
  echo "ℹ️  No sliders found."
  exit 0
fi

# Delete each slider
echo "🗑️  Deleting sliders..."
for id in $SLIDER_IDS; do
  echo "  Deleting slider: $id"
  curl -s -X DELETE \
    -H "Authorization: Bearer $TOKEN" \
    "$API_URL/sliders/$id" > /dev/null
  echo "  ✅ Deleted: $id"
done

echo ""
echo "✅ All sliders deleted!"
echo ""
echo "📊 Checking result..."
REMAINING=$(curl -s "$API_URL/sliders/active" | jq '. | length')
echo "Remaining sliders: $REMAINING"
