# WhatsApp Configuration

## Setup Instructions

To configure WhatsApp checkout for your store:

1. **Update WhatsApp Number**
   - Open `src/lib/whatsapp.ts`
   - Find the line: `const WHATSAPP_NUMBER = '212600000000';`
   - Replace with your WhatsApp Business number
   - Format: Country code + phone number (no + or spaces)
   - Example for Morocco: `212612345678`
   - Example for Saudi Arabia: `966501234567`

2. **Number Format Examples**
   ```
   Morocco:      212600000000
   Saudi Arabia: 966500000000
   UAE:          971500000000
   Egypt:        201000000000
   Algeria:      213500000000
   ```

3. **Testing**
   - Click "Buy Now via WhatsApp" on any product
   - Should open WhatsApp Web/App with pre-filled message
   - Message includes: product name, brand, quantity, price, link

## Message Template

### Single Product
```
🛍️ *طلب منتج جديد*

*المنتج:* [Product Name]
*العلامة التجارية:* [Brand]
*الكمية:* [Quantity]
*السعر:* [Price] درهم
*المجموع:* [Total] درهم

📎 *رابط المنتج:*
[Product URL]

---
أود تأكيد هذا الطلب، شكراً!
```

### Cart Checkout
```
🛒 *طلب سلة مشتريات*

*المنتجات:*
1. *[Product 1]*
   العلامة: [Brand]
   الكمية: [Qty]
   السعر: [Price] درهم
   المجموع: [Subtotal] درهم
   الرابط: [URL]

2. *[Product 2]*
   ...

📊 *الملخص:*
عدد المنتجات: [Total Items]
*المجموع الكلي:* [Total Price] درهم

---
أود تأكيد هذا الطلب، شكراً!
```

## Customization

### Change Message Language
Edit messages in `src/lib/whatsapp.ts`:
- `generateWhatsAppMessageSingle()` - for single product
- `generateWhatsAppMessageCart()` - for cart checkout

### Add Customer Info Fields
You can extend the functions to include:
- Customer name
- Delivery address
- Phone number
- Special instructions

Example:
```typescript
export function buyNowWhatsApp(
  product: Product,
  quantity: number,
  customerInfo?: { name: string; phone: string; address: string }
): void {
  const message = `
🛍️ *طلب منتج جديد*

*بيانات العميل:*
الاسم: ${customerInfo?.name || 'غير محدد'}
الهاتف: ${customerInfo?.phone || 'غير محدد'}
العنوان: ${customerInfo?.address || 'غير محدد'}

*المنتج:* ${product.name}
...
  `.trim();
  
  openWhatsAppCheckout(encodeURIComponent(message));
}
```

## Usage in Components

### Product Detail Page
```tsx
import { buyNowWhatsApp } from '@/lib/whatsapp';

<Button onClick={() => buyNowWhatsApp(product, quantity)}>
  Buy Now via WhatsApp
</Button>
```

### Cart
```tsx
import { checkoutCartWhatsApp } from '@/lib/whatsapp';

<Button onClick={() => checkoutCartWhatsApp(cartItems)}>
  Checkout via WhatsApp
</Button>
```

## Benefits

✅ No payment gateway fees
✅ Direct customer communication
✅ Easy order tracking via WhatsApp
✅ Build customer relationships
✅ Perfect for cash on delivery
✅ Works on mobile and desktop

## Next Steps

After receiving WhatsApp orders:
1. Confirm order details with customer
2. Confirm delivery address
3. Calculate final price (with delivery)
4. Process order and arrange delivery
5. Send tracking updates via WhatsApp
