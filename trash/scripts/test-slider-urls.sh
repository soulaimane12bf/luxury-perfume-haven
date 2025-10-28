#!/bin/bash

API_URL="https://luxury-perfume-haven.vercel.app/api"

echo "🎯 Slider URL Test - Deleting Old & Checking New Short URLs"
echo "============================================================="
echo ""

# Login
echo "🔐 Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admintest"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Logged in successfully!"
echo ""

# Get all sliders
echo "📋 Current sliders:"
SLIDERS=$(curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/sliders")
echo "$SLIDERS" | jq -r '.[] | "  - ID: \(.id)\n    URL: \(.image_url)\n    Title: \(.title)\n"'

# Count sliders
SLIDER_COUNT=$(echo $SLIDERS | jq '. | length')
echo "Total: $SLIDER_COUNT sliders"
echo ""

if [ "$SLIDER_COUNT" -gt 0 ]; then
  # Delete all sliders
  echo "🗑️  Deleting all sliders..."
  SLIDER_IDS=$(echo $SLIDERS | jq -r '.[].id')
  
  for id in $SLIDER_IDS; do
    echo "  Deleting: $id"
    DELETE_RESPONSE=$(curl -s -X DELETE \
      -H "Authorization: Bearer $TOKEN" \
      "$API_URL/sliders/$id")
    echo "  ✅ $DELETE_RESPONSE"
  done
  echo ""
fi

# Verify deletion
echo "📊 Verifying deletion..."
REMAINING=$(curl -s "$API_URL/sliders/active" | jq '. | length')
echo "Remaining sliders: $REMAINING"
echo ""

echo "============================================================="
echo "✅ All old sliders deleted!"
echo ""
echo "📝 Next Steps:"
echo "   1. Go to Admin Panel: https://luxury-perfume-haven.vercel.app/admin"
echo "   2. Login with: admin / change_me_now"
echo "   3. Go to 'السلايدر' tab"
echo "   4. Click 'إضافة شريحة جديدة'"
echo "   5. Upload an image file"
echo "   6. Fill in details and save"
echo ""
echo "   The new slider will have a SHORT URL like:"
echo "   https://...vercel-storage.com/sliders/abc123.jpg"
echo "   (instead of the long timestamp-based URLs)"
echo ""
echo "   Then run this script again to see the new short URLs!"
echo "============================================================="
