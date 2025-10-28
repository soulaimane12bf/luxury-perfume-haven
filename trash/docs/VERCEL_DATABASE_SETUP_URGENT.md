# 🚨 URGENT: Database Setup Required

## Current Status
- ✅ Frontend is deployed and accessible
- ❌ API endpoints returning 500 errors
- ❌ **Reason: No database connected**

## Quick Fix (5 minutes)

### Option 1: Vercel Postgres (Easiest - Recommended)

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/marwanelachhabs-projects/luxury-perfume-haven
   ```

2. **Click "Storage" tab** at the top

3. **Click "Create Database"** → Select **"Postgres"**

4. **Follow the wizard:**
   - Database name: `perfume-haven-db`
   - Region: Select closest to you
   - Click "Create"

5. **Vercel will automatically add these environment variables:**
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - And others...

6. **Add additional required variables:**
   Go to: https://vercel.com/marwanelachhabs-projects/luxury-perfume-haven/settings/environment-variables
   
   Add these for **Production** environment:
   ```
   SEED=true
   JWT_SECRET=rEOYZrpvUsdNDcZXsvUjE80XXHZkVp06uSm0FD04hkc=
   NODE_ENV=production
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=admin@luxury-perfume-haven.com
   ADMIN_PASSWORD=Admin@2025!Secure
   ```

7. **Redeploy:**
   ```bash
   vercel --prod --yes
   ```

8. **After first successful deployment, change SEED to false:**
   - Go back to environment variables
   - Change `SEED=true` to `SEED=false`
   - Redeploy again

---

### Option 2: PlanetScale (Free MySQL)

1. **Sign up:** https://planetscale.com

2. **Create database:** `perfume-haven`

3. **Get connection string** from PlanetScale dashboard

4. **Add to Vercel:**
   ```
   [REDACTED_DB_URL]
   ```
   
   OR individual variables:
   ```
   DB_HOST=xxx.connect.psdb.cloud
   DB_USER=xxx
   DB_PASSWORD=xxx
   DB_NAME=perfume_haven
   DB_USE_SSL=true
   ```

5. **Add other required variables** (same as Option 1 above)

6. **Redeploy:**
   ```bash
   vercel --prod --yes
   ```

---

### Option 3: Railway (Free MySQL/Postgres)

1. **Sign up:** https://railway.app

2. **New Project** → **Add MySQL** (or PostgreSQL)

3. **Copy connection string**

4. **Add to Vercel** (same as Option 2)

5. **Redeploy**

---

## Required Environment Variables Summary

Add ALL of these to Vercel for **Production**:

```env
# Database (one of these sets)
[REDACTED_DB_URL]
# OR
DB_HOST=<host>
DB_USER=<user>
DB_PASSWORD=<password>
DB_NAME=perfume_haven
DB_PORT=3306  # or 5432 for postgres
DB_USE_SSL=true

# Application
SEED=true  # Set to false after first deploy
JWT_SECRET=rEOYZrpvUsdNDcZXsvUjE80XXHZkVp06uSm0FD04hkc=
NODE_ENV=production

# Admin (optional but recommended)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@luxury-perfume-haven.com
ADMIN_PASSWORD=Admin@2025!Secure
ADMIN_WHATSAPP=+212600000000
```

---

## After Database Setup

1. **Test the API:**
   ```bash
   curl https://luxury-perfume-haven.vercel.app/api/health
   curl https://luxury-perfume-haven.vercel.app/api/products
   curl https://luxury-perfume-haven.vercel.app/api/sliders/active
   ```

2. **Login to admin panel:**
   ```
   URL: https://luxury-perfume-haven.vercel.app/admin/login
   Username: admin
   Password: Admin@2025!Secure
   ```
   
   ⚠️ **CHANGE PASSWORD IMMEDIATELY AFTER FIRST LOGIN!**

3. **Upload slider images:**
   - Go to "الصور المتحركة" (Sliders) in admin
   - Delete placeholder sliders
   - Add your real slider images

---

## Why This Happened

Your backend code is deployed, but it needs a database to work. The backend checks for database connection at startup:

```javascript
if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
  console.warn('No database configuration found. Skipping database initialization.');
  databaseReady = false;
  return false;
}
```

Without database variables, all API endpoints return 500 because they can't connect to the database.

---

## Fastest Solution

**Vercel Postgres** is the absolute fastest (literally 2 clicks):
1. Storage tab → Create Database → Postgres
2. Wait 30 seconds for provisioning
3. Redeploy with `vercel --prod --yes`
4. Done! ✅

Total time: **< 3 minutes**
