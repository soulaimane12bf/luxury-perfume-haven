#!/bin/bash

echo "🧪 COMPREHENSIVE EMAIL DELIVERY TEST"
echo "===================================="
echo ""

ORDER_ID="order-$(date +%s)"

echo "📝 Creating test order..."
echo "Order ID: $ORDER_ID"
echo ""

START_TIME=$(date +%s)

RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}\nTIME_TOTAL:%{time_total}" \
  -X POST https://luxury-perfume-haven.vercel.app/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Email Test User",
    "customer_phone": "212677777777",
    "customer_email": "test@example.com",
    "customer_address": "Test Address, Casablanca",
    "items": [
      {
        "name": "Chanel No 5",
        "quantity": 1,
        "price": 499,
        "image_url": "https://example.com/chanel.jpg"
      }
    ],
    "total_amount": 499,
    "notes": "Email delivery test"
  }' 2>&1)

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "$RESPONSE" | grep -v "HTTP_CODE:" | grep -v "TIME_TOTAL:" | jq '.' 2>/dev/null || echo "$RESPONSE"

HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d: -f2)
TIME_TOTAL=$(echo "$RESPONSE" | grep "TIME_TOTAL:" | cut -d: -f2)

echo ""
echo "📊 RESULTS:"
echo "--------"
echo "HTTP Status: $HTTP_CODE"
echo "Response Time: ${TIME_TOTAL}s"
echo "Total Duration: ${DURATION}s"
echo ""

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Order created successfully!"
    echo ""
    echo "📧 CHECK YOUR EMAIL: Check your configured admin email"
    echo "   You should receive an email within 1-2 minutes"
    echo ""
    
    # Get the order ID from response
    CREATED_ORDER_ID=$(echo "$RESPONSE" | jq -r '.order.id' 2>/dev/null)
    if [ "$CREATED_ORDER_ID" != "null" ] && [ -n "$CREATED_ORDER_ID" ]; then
        echo "🔍 Checking Vercel logs for email status..."
        sleep 3
        echo ""
        vercel logs https://luxury-perfume-haven.vercel.app --since 1m 2>&1 | grep -E "$CREATED_ORDER_ID|Email|email" | head -20
    fi
else
    echo "❌ Order creation failed!"
    echo "HTTP Status: $HTTP_CODE"
fi

echo ""
echo "===================================="
