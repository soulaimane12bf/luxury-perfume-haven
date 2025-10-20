# 📧 Email & WhatsApp Notifications Setup Guide

## Problem
When testing orders, you're not receiving email or WhatsApp notifications because the email and WhatsApp settings are not configured in the backend.

## Solution: Configure Email (Gmail)

### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Scroll to "How you sign in to Google"
4. Click on **2-Step Verification** and enable it

### Step 2: Generate App Password
1. After enabling 2FA, go back to Security settings
2. Scroll to "How you sign in to Google"
3. Click on **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter a name like "Perfume Store Notifications"
6. Click **Generate**
7. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update Backend .env File
Edit `/workspaces/luxury-perfume-haven/backend/.env` and add:

```bash
# Email Configuration (for order notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-real-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Admin Email (where notifications will be sent)
ADMIN_EMAIL=your-real-email@gmail.com

# Admin WhatsApp (format: country code + number, no +)
ADMIN_WHATSAPP=212612345678
```

**Replace with your actual:**
- `EMAIL_USER`: Your Gmail address (e.g., `walid.perfumes@gmail.com`)
- `EMAIL_PASS`: The 16-character app password from Step 2 (remove spaces)
- `ADMIN_EMAIL`: Same as EMAIL_USER or another email to receive notifications
- `ADMIN_WHATSAPP`: Your WhatsApp number with country code (e.g., `212612345678` for Morocco)

### Step 4: Restart Backend Server
After updating `.env`, restart the backend:
```bash
pkill -f "node src/app.js"
cd /workspaces/luxury-perfume-haven/backend && node src/app.js &
```

## Alternative: Update Via Admin Profile (Recommended)

Instead of editing `.env` directly, you can update from the admin dashboard:

1. Login to admin: http://localhost:8080/admin
2. Username: `admin`, Password: `admin123`
3. Go to **"الملف الشخصي"** (Profile) tab
4. Update:
   - **Email**: Your real email address
   - **Phone**: Your WhatsApp number (format: 212612345678)
5. Click **"حفظ التغييرات"** (Save Changes)

**Important**: You still need to configure EMAIL_USER and EMAIL_PASS in .env for sending emails!

## WhatsApp Notifications

WhatsApp notifications work differently:
- The system generates a WhatsApp URL with the order details
- You need to manually open this URL to send the message
- The URL is logged in the backend console when an order is placed

**To get real WhatsApp notifications:**
1. Check backend console/logs after an order
2. Look for: `📱 WhatsApp notification URL: https://wa.me/...`
3. Click the URL to open WhatsApp with pre-filled message

**For automatic WhatsApp messages**, you would need:
- WhatsApp Business API (paid service)
- Or a third-party service like Twilio, MessageBird, etc.

## Testing the Setup

### Test Email:
1. Make sure `.env` has correct EMAIL_USER and EMAIL_PASS
2. Restart backend server
3. Place a test order from the website
4. Check your email inbox (and spam folder)
5. Backend logs should show: `✅ Email notification sent successfully to: your-email@gmail.com`

### Test WhatsApp:
1. Update ADMIN_WHATSAPP in `.env` OR in admin profile
2. Restart backend server
3. Place a test order
4. Check backend logs for WhatsApp URL
5. Click the URL to open WhatsApp

## Common Issues

### ❌ Email not sending
**Cause**: Wrong EMAIL_USER or EMAIL_PASS
**Solution**: 
- Make sure 2FA is enabled on Gmail
- Regenerate app password
- Copy password without spaces
- Check for typos in email address

### ❌ "Invalid login" or "Authentication failed"
**Cause**: Using regular Gmail password instead of app password
**Solution**: Use the 16-character app password from Google Account settings

### ❌ WhatsApp URL not working
**Cause**: Wrong phone number format
**Solution**: 
- Use format: country code + number (no +, no spaces)
- Example Morocco: `212612345678`
- Example USA: `15551234567`

## Email Providers

### Gmail (Recommended)
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=app-password
```

### Outlook/Hotmail
```bash
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo
```bash
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=app-password
```

## Quick Setup Checklist

- [ ] Enable 2FA on Gmail
- [ ] Generate App Password
- [ ] Update EMAIL_USER in .env
- [ ] Update EMAIL_PASS in .env
- [ ] Update ADMIN_EMAIL in .env
- [ ] Update ADMIN_WHATSAPP in .env
- [ ] Restart backend server
- [ ] Test with a real order
- [ ] Check email inbox
- [ ] Check backend logs for WhatsApp URL

## Need Help?

If emails still don't work:
1. Check backend logs for error messages
2. Verify Gmail app password is correct (no spaces)
3. Make sure 2FA is enabled
4. Try regenerating the app password
5. Check spam/junk folder

---

**Note**: For production, consider using dedicated email services like:
- SendGrid (free tier: 100 emails/day)
- Mailgun (free tier: 5000 emails/month)
- Amazon SES (very cheap)

These are more reliable than Gmail for transactional emails.
