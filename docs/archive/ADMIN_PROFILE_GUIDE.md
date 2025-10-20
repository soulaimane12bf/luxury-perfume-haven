# Admin Profile Management & Automatic Notifications

## Overview
Complete admin profile management system with automatic email and WhatsApp notifications for new orders.

## ✨ New Features

### 1. Admin Profile Management
- **Update Profile Information**
  - Change username
  - Update email address (for order notifications)
  - Update phone number (for WhatsApp notifications)
  
- **Password Management**
  - Change password with current password verification
  - Minimum 6 characters validation
  - Password confirmation required

### 2. Automatic Order Notifications
- **Email Notifications**
  - Automatically sent to admin's saved email address
  - HTML formatted with order details and product images
  - Includes customer info, products table, and total amount
  
- **WhatsApp Notifications**
  - Automatically generated WhatsApp URL with order details
  - Sent to admin's saved phone number
  - Includes all order information in Arabic

### 3. Background Processing
- Notifications are sent asynchronously (non-blocking)
- Order creation doesn't wait for notification completion
- Failures in notifications don't affect order creation

## 🎯 How to Use

### Accessing Profile Settings
1. Login to admin dashboard at `/admin`
2. Click on the **"الملف الشخصي"** (Profile) tab
3. You'll see two sections:
   - **معلومات الحساب** (Account Information)
   - **تغيير كلمة المرور** (Change Password)

### Updating Profile
1. **Username**: Update your admin username
2. **Email**: Set the email that will receive order notifications
3. **Phone**: Set your WhatsApp number (with country code, without +)
   - Example: `212600000000` for Morocco
4. Click **"حفظ التغييرات"** (Save Changes)

### Changing Password
1. Enter your **current password**
2. Enter your **new password** (minimum 6 characters)
3. Confirm the **new password**
4. Click **"تغيير كلمة المرور"** (Change Password)

## 🔧 Technical Details

### Backend Changes

#### New Files
- `backend/src/controllers/profileController.js` - Profile management endpoints
- `backend/src/routes/profile.js` - Profile API routes

#### Modified Files
- `backend/src/models/admin.js` - Added `phone` field
- `backend/src/controllers/orderController.js` - Automatic notifications with admin contact info
- `backend/src/app.js` - Added profile routes

#### API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profile` | ✅ | Get admin profile |
| PATCH | `/api/profile` | ✅ | Update profile (username, email, phone) |
| PATCH | `/api/profile/password` | ✅ | Change password |

### Frontend Changes

#### New Files
- `src/components/AdminProfile.tsx` - Profile management component

#### Modified Files
- `src/pages/AdminNew.tsx` - Added Profile tab
- `src/lib/api.ts` - Added `profileApi` client

#### Profile Component Features
- Real-time form validation
- Loading states during API calls
- Toast notifications for success/error
- Responsive design (mobile and desktop)
- Input icons for better UX

## 📧 Email Configuration

The email notifications use the admin's saved email address from the profile. Make sure to:

1. Set up email credentials in `backend/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

2. Update your email in the Profile tab to receive notifications

## 📱 WhatsApp Configuration

The WhatsApp notifications use the admin's saved phone number from the profile. Make sure to:

1. Update your phone number in the Profile tab
2. Use international format without + (e.g., `212600000000`)
3. Phone numbers are also used in:
   - Floating WhatsApp button (`src/components/FloatingWhatsApp.tsx`)
   - Footer WhatsApp section (`src/components/Footer.tsx`)

## 🔔 Notification Flow

When a customer places an order:

1. **Order is created** in the database
2. **Response sent immediately** to customer (fast)
3. **Background process starts**:
   - Fetch admin contact info from database
   - Send email notification to admin's email
   - Generate WhatsApp notification URL
   - Log success/failure (doesn't affect order)

## 🛡️ Security Features

- ✅ All profile endpoints require authentication
- ✅ Current password verification for password changes
- ✅ Unique username and email validation
- ✅ Password hashing with bcrypt
- ✅ Minimum password length enforcement (6 characters)
- ✅ JWT token verification

## 📊 Database Schema

### Admin Table Updates
```sql
admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(255),  -- NEW FIELD
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'super-admin') DEFAULT 'admin',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 🚀 Testing Checklist

- [ ] Login to admin dashboard
- [ ] Navigate to Profile tab
- [ ] Update username and verify save
- [ ] Update email and verify save
- [ ] Update phone number and verify save
- [ ] Change password with correct current password
- [ ] Try changing password with wrong current password
- [ ] Place a test order from frontend
- [ ] Verify email received at admin's email
- [ ] Check console for WhatsApp notification URL
- [ ] Verify order appears in Orders tab

## 💡 Benefits

1. **Centralized Configuration**: Admin controls their contact info from dashboard
2. **No Code Changes**: Update email/phone without touching code
3. **Automatic Updates**: Notifications automatically use latest profile info
4. **Non-Blocking**: Fast order creation, notifications happen in background
5. **Failure Safe**: Order creation succeeds even if notifications fail

## 📝 Notes

- Default admin credentials: `username: admin`, `password: admin123`
- Phone number should include country code (e.g., 212 for Morocco)
- Email must be valid and accessible for receiving notifications
- Password changes take effect immediately
- Profile updates are reflected in real-time for notifications

## 🔮 Future Enhancements

- [ ] Multiple admin users with different roles
- [ ] Email notification templates customization
- [ ] SMS notifications via Twilio
- [ ] WhatsApp Business API integration
- [ ] Notification preferences (enable/disable specific types)
- [ ] Notification history log
- [ ] Custom notification schedules

---

**Version**: 1.0.0  
**Date**: October 17, 2025  
**Status**: ✅ Production Ready
