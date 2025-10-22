#!/bin/bash

API_URL="https://luxury-perfume-haven.vercel.app/api"

echo "🔧 Fixing Slider Order"
echo "====================="
echo ""

# Login
echo "🔐 Logging in..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admintest"}' | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  exit 1
fi

echo "✅ Logged in!"
echo ""

# Get all sliders
echo "📋 Getting sliders..."
SLIDERS=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/sliders")

# Extract slider IDs and update their order
echo "$SLIDERS" | jq -c '.[]' | while IFS= read -r slider; do
  ID=$(echo "$slider" | jq -r '.id')
  TITLE=$(echo "$slider" | jq -r '.title')
  CURRENT_ORDER=$(echo "$slider" | jq -r '.order')
  
  echo "  Slider: $TITLE (ID: $ID, Current Order: $CURRENT_ORDER)"
done

echo ""
echo "🔧 Updating orders..."

# Get slider IDs as array
SLIDER_IDS=($(echo "$SLIDERS" | jq -r '.[] | .id'))

# Update each slider with a new order (0, 1, 2, etc.)
ORDER=0
for id in "${SLIDER_IDS[@]}"; do
  echo "  Setting order $ORDER for slider: $id"
  
  curl -s -X PUT \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"order\": $ORDER}" \
    "$API_URL/sliders/$id" > /dev/null
  
  ORDER=$((ORDER + 1))
done

echo ""
echo "✅ Order updated!"
echo ""
echo "📊 Final result:"
curl -s "$API_URL/sliders/active" | jq -r '.[] | "  \(.order). \(.title) - \(.image_url)"'
echo ""
