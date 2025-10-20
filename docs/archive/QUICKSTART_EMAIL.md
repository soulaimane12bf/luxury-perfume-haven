# 🚀 QUICK START: Enable Email Notifications

## Why emails aren't working
Your backend doesn't have email credentials configured. Gmail requires an "App Password" (NOT your regular password).

## ⚡ Quick Setup (5 minutes)

### Option 1: Automatic Setup (Recommended)
Run this command and follow the prompts:
```bash
cd /workspaces/luxury-perfume-haven && ./setup-email.sh
```

### Option 2: Manual Setup

#### Step 1: Get Gmail App Password
1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification" (if not enabled)
3. Click "App passwords" 
4. Select "Mail" → "Other" → Enter "Perfume Store"
5. Click "Generate"
6. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

#### Step 2: Update Configuration
Edit `/workspaces/luxury-perfume-haven/backend/.env`:

```bash
EMAIL_USER=your-real-email@gmail.com
EMAIL_PASS=abcdefghijklmnop
ADMIN_EMAIL=your-real-email@gmail.com
ADMIN_WHATSAPP=212612345678
```

**Replace with YOUR actual:**
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: The 16-char app password (remove spaces)
- `ADMIN_EMAIL`: Same email or another to receive notifications
- `ADMIN_WHATSAPP`: Your WhatsApp number (country code + number)

#### Step 3: Restart Backend
```bash
pkill -f "node src/app.js"
cd /workspaces/luxury-perfume-haven/backend && node src/app.js &
```

#### Step 4: Test It!
1. Place a test order from your website
2. Check your email inbox
3. Check spam folder if not in inbox

## 📱 WhatsApp Notifications

WhatsApp notifications are **semi-automatic**:
- Backend logs the WhatsApp URL with order details
- You need to click the URL to send the message
- For fully automatic WhatsApp, you need WhatsApp Business API ($$$)

**To see WhatsApp notifications:**
```bash
tail -f /workspaces/luxury-perfume-haven/backend/backend.log
```

Look for: `📱 WhatsApp notification URL: https://wa.me/...`

## ✅ Verify It's Working

After placing an order, check backend logs:
```bash
tail -20 /workspaces/luxury-perfume-haven/backend/backend.log
```

**Success looks like:**
```
✅ Email notification sent successfully to: your-email@gmail.com
📱 WhatsApp notification URL: https://wa.me/212612345678?text=...
✅ Notifications sent successfully for order: 1
```

**Failure looks like:**
```
❌ Error sending email: Invalid login: 535-5.7.8 Username and Password not accepted
```
→ This means wrong email/password. Use App Password!

## 🆘 Still Not Working?

1. **Check backend logs:**
   ```bash
   tail -50 /workspaces/luxury-perfume-haven/backend/backend.log | grep -i error
   ```

2. **Verify .env file has your credentials:**
   ```bash
   cd /workspaces/luxury-perfume-haven/backend && grep EMAIL .env
   ```

3. **Make sure backend restarted:**
   ```bash
   ps aux | grep "node src/app.js"
   ```

4. **Check spam folder** - Gmail may filter automated emails

## 📚 More Help

- **Detailed guide**: See `EMAIL_SETUP_GUIDE.md`
- **Gmail App Password help**: https://support.google.com/accounts/answer/185833
- **Alternative email providers**: See EMAIL_SETUP_GUIDE.md

---

**🎯 Summary:**
1. Get Gmail App Password (NOT regular password)
2. Add to `backend/.env`
3. Restart backend
4. Test with real order
5. Check email + backend logs
