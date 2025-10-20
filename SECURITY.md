# 🔐 Security & Environment Variables Guide

## ⚠️ IMPORTANT: Never Commit Sensitive Data

This project uses environment variables to store sensitive information. **NEVER** commit files containing real credentials to Git!

---

## 📁 Files That Should NEVER Be Committed

✅ **Already in `.gitignore`:**
- `.env`
- `.env.local`
- `.env.*.local`
- `backend/.env`
- `backend/.env.local`
- `backend/.env.production`

❌ **Never commit these with real data:**
- Any file with real email addresses
- Any file with real passwords
- Any file with real API keys
- Any file with real JWT secrets
- Any file with real database credentials

---

## 🔧 Environment Variable Setup

### Frontend `.env`

Create `.env` in the root directory:

```env
VITE_API_URL=http://localhost:5000
VITE_WHATSAPP_NUMBER=212XXXXXXXXX
```

### Backend `backend/.env`

Create `backend/.env`:

```env
# Database
[REDACTED_DB_URL]
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=perfume_db
DB_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=24h

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
ADMIN_EMAIL=admin@example.com
ADMIN_WHATSAPP=212XXXXXXXXX
```

---

## 📧 How to Get Gmail App Password

1. **Enable 2-Factor Authentication** in your Gmail account
2. Go to: https://myaccount.google.com/security
3. Click **2-Step Verification**
4. Scroll to **App passwords**
5. Generate a new app password for "Mail"
6. Copy the 16-character password
7. Use it in `EMAIL_PASS` (no spaces)

---

## 🚀 Deployment Environment Variables

### Vercel (Frontend)

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend.railway.app
VITE_WHATSAPP_NUMBER=212XXXXXXXXX
```

### Railway (Backend)

Add these in Railway Dashboard → Project → Variables:

```
[REDACTED_DB_URL]
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
ADMIN_EMAIL=admin@example.com
NODE_ENV=production
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Use `.env` files for sensitive data
- Use `.env.example` files with placeholder values
- Add `.env` to `.gitignore`
- Use strong, unique passwords
- Rotate credentials regularly
- Use environment variables in production
- Keep credentials in secure password managers

### ❌ DON'T:
- Commit `.env` files to Git
- Share credentials in Slack/Discord/Email
- Use the same password everywhere
- Hardcode credentials in source code
- Leave default passwords in production
- Share your `.env` file publicly

---

## 🛡️ What To Do If Credentials Are Exposed

If you accidentally commit sensitive data:

1. **Immediately change all exposed credentials**
   - Change Gmail app password
   - Change database password
   - Change JWT secret
   - Change admin password

2. **Remove from Git history**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch backend/.env" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

3. **Update all deployment environments**
   - Update Vercel environment variables
   - Update Railway environment variables

4. **Monitor for unauthorized access**
   - Check admin panel access logs
   - Check email sending logs
   - Check database access

---

## 📝 Example Files

### `.env.example` (Root)
```env
VITE_API_URL=http://localhost:5000
VITE_WHATSAPP_NUMBER=212XXXXXXXXX
```

### `backend/.env.example`
```env
[REDACTED_DB_URL]
JWT_SECRET=replace-with-strong-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
```

---

## 🔍 Checking for Exposed Credentials

Before committing, always check:

```bash
# Check what files will be committed
git status

# Check if .env files are being tracked
git ls-files | grep .env

# Search for sensitive patterns
git grep -i "password\|secret\|api_key\|token"

# Check staged changes
git diff --cached
```

---

## 📚 Additional Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

---

## ✅ Quick Checklist

Before every commit:

- [ ] No `.env` files in staging area
- [ ] No real passwords in code
- [ ] No real email addresses in code
- [ ] No API keys hardcoded
- [ ] `.env.example` has only placeholders
- [ ] `.gitignore` includes `.env`

---

**Remember: Security is not optional. Protect your credentials!** 🔒
