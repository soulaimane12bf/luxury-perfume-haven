# 📦 Order Management System Documentation

## Overview
Complete order management system with customer information collection, email notifications, WhatsApp integration, and admin management interface.

---

## 🎯 Features

### Customer Features
1. **Place Orders**
   - Buy single product from product page
   - Checkout entire cart
   - Fill customer information form
   - Optional email field
   - Order confirmation

2. **Order Form Fields**
   - Full Name (Required)
   - Phone Number (Required)
   - Email (Optional)
   - Complete Address (Required)
   - Additional Notes (Optional)

3. **WhatsApp Integration**
   - Floating WhatsApp button on all pages (bottom-left)
   - WhatsApp contact section in footer
   - Direct contact with seller

### Admin Features
1. **Order Management Dashboard**
   - View all orders
   - Customer information display
   - Order items and quantities
   - Total amount
   - Order status tracking
   - Delete orders

2. **Order Status Updates**
   - Pending (قيد الانتظار)
   - Confirmed (مؤكد)
   - Processing (قيد التجهيز)
   - Shipped (تم الشحن)
   - Delivered (تم التسليم)
   - Cancelled (ملغي)

3. **Notifications**
   - Email notification when new order placed
   - WhatsApp message notification
   - Includes all order details

### Responsive Design
- Mobile-friendly order forms
- Card layout for mobile admin view
- Table layout for desktop admin view

---

## 🔧 Technical Implementation

### Backend

#### Order Model (`backend/src/models/order.js`)
```javascript
{
  id: String (auto-generated),
  customer_name: String (required),
  customer_email: String (optional),
  customer_phone: String (required),
  customer_address: Text (required),
  items: JSON Array [{
    product_id, name, price, quantity, image_url
  }],
  total_amount: Decimal,
  status: Enum (pending, confirmed, processing, shipped, delivered, cancelled),
  notes: Text (optional),
  created_at: DateTime,
  updated_at: DateTime
}
```

#### API Endpoints

**Public Endpoints:**
- `POST /api/orders` - Create new order

**Admin Endpoints (Protected):**
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

#### Email Configuration
Uses nodemailer to send HTML emails to admin with:
- Customer information
- Order items with images
- Total amount
- Order ID

#### WhatsApp Integration
Generates WhatsApp URL with pre-filled message containing:
- Order number
- Customer details
- Product list
- Total amount

### Frontend

#### Components

**OrderForm (`src/components/OrderForm.tsx`)**
- Dialog-based form
- Form validation
- Customer information fields
- Order summary
- Success callback
- Error handling

**FloatingWhatsApp (`src/components/FloatingWhatsApp.tsx`)**
- Fixed position button
- Animated (bounce effect)
- Opens WhatsApp with pre-filled message
- Visible on all pages

#### Integration Points

**Product Single Page:**
```tsx
// Buy Now button opens order form
<Button onClick={() => setOrderFormOpen(true)}>
  اشتري الآن
</Button>

<OrderForm
  items={[{ product, quantity }]}
  totalAmount={price * quantity}
  onSuccess={handleSuccess}
/>
```

**Cart Drawer:**
```tsx
// Checkout button for all cart items
<Button onClick={handleCheckout}>
  إتمام الطلب
</Button>

// Cart clears after successful order
onSuccess={clearCart}
```

**Admin Dashboard:**
- Orders tab (first tab by default)
- Desktop: Table with inline status selector
- Mobile: Card layout with action buttons

---

## 📧 Email Setup

### Gmail Configuration

1. **Enable 2-Factor Authentication:**
   - Go to Google Account settings
   - Security > 2-Step Verification
   - Turn on 2FA

2. **Generate App Password:**
   - Google Account > Security
   - 2-Step Verification > App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated password

3. **Update .env File:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
ADMIN_EMAIL=admin@parfumeurwalid.com
```

### Other Email Providers

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=465
```

---

## 📱 WhatsApp Setup

### Update Phone Numbers

**FloatingWhatsApp Component:**
```tsx
// src/components/FloatingWhatsApp.tsx
const adminPhone = '212600000000'; // Replace with your number
```

**Footer Component:**
```tsx
// src/components/Footer.tsx
href="https://wa.me/212600000000?text=..."
```

**Backend Controller:**
```javascript
// backend/src/controllers/orderController.js
const adminPhone = process.env.ADMIN_WHATSAPP || '212600000000';
```

### Phone Number Format
- Include country code without "+"
- Example: Morocco = 212600000000
- Example: USA = 1234567890

---

## 🚀 Usage Guide

### For Customers

1. **Single Product Purchase:**
   - Browse to product page
   - Select quantity
   - Click "اشتري الآن" (Buy Now)
   - Fill order form
   - Submit order
   - Receive confirmation

2. **Cart Purchase:**
   - Add products to cart
   - Open cart drawer
   - Click "إتمام الطلب" (Complete Order)
   - Fill order form
   - Submit order
   - Cart automatically clears

3. **Contact Seller:**
   - Click floating WhatsApp button (bottom-left)
   - Or click WhatsApp section in footer
   - Message opens automatically

### For Admin

1. **View Orders:**
   - Login to admin dashboard
   - Orders tab (default view)
   - See all orders with details

2. **Update Order Status:**
   - Select new status from dropdown
   - Status updates automatically
   - Customer can track progress

3. **Check Notifications:**
   - Check email for new order alerts
   - Click WhatsApp link in notification
   - Contact customer directly

4. **Manage Orders:**
   - Delete completed/cancelled orders
   - Keep records of active orders
   - Track order statistics

---

## 🔒 Security

- JWT authentication for admin endpoints
- Form validation on frontend
- Server-side validation
- SQL injection protection (Sequelize ORM)
- XSS prevention
- CORS configuration

---

## 📊 Database Schema

```sql
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  customer_phone VARCHAR(255) NOT NULL,
  customer_address TEXT NOT NULL,
  items JSON NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','confirmed','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🎨 Customization

### Change Order Statuses
Edit in both places:
1. `backend/src/models/order.js` - Model definition
2. `src/pages/AdminNew.tsx` - Status selector options

### Modify Email Template
Edit `sendEmailNotification()` function in:
`backend/src/controllers/orderController.js`

### Customize Order Form
Edit `src/components/OrderForm.tsx`:
- Add/remove fields
- Change validation rules
- Modify success messages

### Style FloatingWhatsApp Button
Edit `src/components/FloatingWhatsApp.tsx`:
- Change position (bottom-6 left-6)
- Modify colors
- Adjust animation

---

## 🐛 Troubleshooting

### Email Not Sending
- Check .env configuration
- Verify app password (not regular password)
- Check firewall/antivirus blocking port 587
- Test with different email provider

### Orders Not Appearing
- Check backend console for errors
- Verify database connection
- Check authentication token
- Refresh admin dashboard

### WhatsApp Button Not Working
- Verify phone number format
- Check URL encoding
- Test on mobile device

### Form Validation Errors
- Check required fields
- Verify phone number format
- Test email format (if provided)

---

## 📝 Future Enhancements

- Order tracking page for customers
- SMS notifications
- Invoice PDF generation
- Payment gateway integration
- Order history for customers
- Automated status updates
- Shipping tracking integration
- Customer accounts
- Order analytics dashboard
- Export orders to CSV/Excel

---

## 🤝 Support

For issues or questions:
1. Check console for error messages
2. Review backend logs
3. Verify environment variables
4. Test with different browsers
5. Check network tab for API errors

---

## ✅ Checklist for Deployment

- [ ] Update phone numbers in all components
- [ ] Configure email settings in .env
- [ ] Test order creation
- [ ] Test email notifications
- [ ] Test WhatsApp links
- [ ] Verify admin dashboard access
- [ ] Test on mobile devices
- [ ] Check responsive design
- [ ] Verify order status updates
- [ ] Test error handling

---

**System Version:** 1.0.0  
**Last Updated:** October 17, 2025  
**Status:** ✅ Production Ready
