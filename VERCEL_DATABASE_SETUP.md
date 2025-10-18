# Vercel Database Setup Guide

Your app is successfully deployed to: **https://luxury-perfume-haven.vercel.app**

## Current Status
✅ Frontend is fully functional  
✅ Backend API is deployed as serverless functions  
⚠️ Database endpoints return 503 (expected - no DB configured yet)

## Quick Database Setup Options

### Option 1: Vercel Postgres (Recommended - Easiest)
1. Go to: https://vercel.com/marwanelachhabs-projects/luxury-perfume-haven
2. Click **Storage** tab
3. Click **Create Database** → **Postgres**
4. Follow the wizard to create your database
5. Vercel will automatically inject environment variables
6. Redeploy: `vercel --prod`

### Option 2: PlanetScale (MySQL - Free Tier Available)
1. Sign up at https://planetscale.com
2. Create a new database
3. Get connection string from dashboard
4. Add to Vercel Environment Variables:
   ```
   [REDACTED_DB_URL]
   ```
5. Or use individual variables:
   ```
   DB_HOST=xxx.connect.psdb.cloud
   DB_USER=xxx
   DB_PASSWORD=xxx
   DB_NAME=your-database
   DB_USE_SSL=true
   ```
6. Redeploy: `vercel --prod`

### Option 3: Railway (MySQL/PostgreSQL - Free Tier)
1. Sign up at https://railway.app
2. Create new project → Add MySQL
3. Copy connection string
4. Add to Vercel (same as PlanetScale above)
5. Redeploy: `vercel --prod`

### Option 4: Existing MySQL Server
If you have an existing MySQL server:

1. Go to: https://vercel.com/marwanelachhabs-projects/luxury-perfume-haven/settings/environment-variables
2. Add these variables for **Production** environment:
   ```
   DB_HOST=your-host.com
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=perfume_haven
   DB_PORT=3306
   DB_USE_SSL=true
   ```
3. Redeploy: `vercel --prod`

## After Adding Database Variables

### Enable Seeding (Optional)
To populate the database with initial data, add this environment variable:
```
SEED=true
```

### Admin Account
After seeding, you can customize the admin account by adding:
```
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
ADMIN_WHATSAPP=+1234567890
```

## Testing After Database Setup

Once database is configured and redeployed:

```bash
# Test API health
curl https://luxury-perfume-haven.vercel.app/api/health

# Test products endpoint
curl https://luxury-perfume-haven.vercel.app/api/products

# Test categories
curl https://luxury-perfume-haven.vercel.app/api/categories
```

All should return 200 OK with data instead of 503.

## Troubleshooting

### CORS Errors
- ✅ Already fixed in latest deployment
- Frontend and backend are on the same domain

### 503 Service Unavailable
- This is expected behavior when database is not configured
- Add database environment variables to fix

### Database Connection Timeout
- Make sure `DB_USE_SSL=true` if using cloud database
- Check firewall/IP whitelist (most cloud DBs need this)
- For Vercel, you may need to whitelist all IPs or use connection pooling

## Quick Redeploy Command

After any environment variable changes:
```bash
cd /workspaces/luxury-perfume-haven
vercel --prod
```

## Support Links
- **Your Deployment:** https://luxury-perfume-haven.vercel.app
- **Vercel Dashboard:** https://vercel.com/marwanelachhabs-projects/luxury-perfume-haven
- **Environment Variables:** https://vercel.com/marwanelachhabs-projects/luxury-perfume-haven/settings/environment-variables
- **Deployment Logs:** https://vercel.com/marwanelachhabs-projects/luxury-perfume-haven/deployments
