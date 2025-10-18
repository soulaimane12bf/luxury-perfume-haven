# 🚂 Quick Setup: Deploy Backend to Railway

## Why Railway?
- ✅ **FREE** for small apps
- ✅ No function limits
- ✅ Supports PostgreSQL (Neon)
- ✅ Easy deployment from GitHub
- ✅ 5-minute setup

---

## Step-by-Step Guide

### 1. Sign Up for Railway
1. Go to [railway.app](https://railway.app)
2. Click "Login with GitHub"
3. Authorize Railway to access your repository

### 2. Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `soulaimane12bf/luxury-perfume-haven`
4. Railway will detect it's a Node.js app

### 3. Configure Backend Service
1. Railway will try to deploy the root - we need to configure it for `/backend`
2. Click on the service → Settings
3. Set these configurations:

**Root Directory**:
```
backend
```

**Build Command**:
```
npm install
```

**Start Command**:
```
node server.js
```

**Watch Paths** (optional):
```
backend/**
```

### 4. Add Environment Variables
Click on "Variables" tab and add:

```bash
# Database (use your existing Neon database)
POSTGRES_URL=postgresql://neondb_owner:npg_...@ep-....aws.neon.tech/neondb?sslmode=require
DATABASE_URL=postgresql://neondb_owner:npg_...@ep-....aws.neon.tech/neondb?sslmode=require

# Application
NODE_ENV=production
PORT=3000
SEED=false

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=24h

# Admin (same as before)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@luxuryperfume.ma
ADMIN_PASSWORD=Admin@2025!Secure

# CORS - Important!
FRONTEND_ORIGIN=https://luxury-perfume-haven.vercel.app
```

**⚠️ IMPORTANT**: Copy your `POSTGRES_URL` from Vercel dashboard → Environment Variables

### 5. Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for deployment
3. Railway will give you a URL like: `https://your-app.railway.app`

### 6. Get Your Railway URL
1. Go to Settings → Networking
2. Click "Generate Domain"
3. Copy the URL (e.g., `https://luxury-perfume-haven-production.up.railway.app`)

### 7. Update Frontend to Use Railway Backend
In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add new variable:
   ```
   VITE_API_URL=https://your-app.railway.app
   ```
3. Redeploy frontend

---

## Alternative: Quick Command Line Setup

If you have Railway CLI installed:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd /workspaces/luxury-perfume-haven/backend
railway init

# Link to your project
railway link

# Add environment variables
railway variables set POSTGRES_URL="your-postgres-url"
railway variables set DATABASE_URL="your-database-url"
railway variables set NODE_ENV="production"
railway variables set JWT_SECRET="your-secret-key"

# Deploy
railway up
```

---

## Testing the Deployment

Once deployed, test your Railway backend:

```bash
# Health check
curl https://your-app.railway.app/api/health

# Should return:
# {"status":"OK","database":"reachable","databaseReady":true}

# Test product endpoint
curl https://your-app.railway.app/api/products/armaf-club-de-nuit

# Should return product data (not 404!)
```

---

## Update Frontend API URL

### Method 1: Environment Variable (Recommended)
In Vercel:
1. Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://your-app.railway.app`
3. Redeploy

### Method 2: Update Code
In `/src/lib/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-app.railway.app';
```

---

## Benefits of This Setup

✅ **No more 404 errors** - All routes work  
✅ **No function limits** - Full Express app runs normally  
✅ **Same database** - Uses your existing Neon PostgreSQL  
✅ **Free tier** - Railway free plan is generous  
✅ **Fast** - Railway has global CDN  
✅ **Easy updates** - Push to GitHub, auto-deploys  

---

## Cost Comparison

| Platform | Cost | Function Limit | Notes |
|----------|------|----------------|-------|
| **Vercel Hobby** | Free | 12 functions | ❌ Current issue |
| **Vercel Pro** | $20/mo | 100 functions | ✅ Works but costs money |
| **Railway** | Free* | No limit | ✅ **Recommended!** |
| **Render** | Free | No limit | ✅ Alternative |

*Railway free tier: $5 credit/month (enough for small apps)

---

## Troubleshooting

### Backend won't start?
Check Railway logs:
```bash
railway logs
```

Common issues:
- Missing environment variables
- Wrong start command
- Port configuration (Railway auto-assigns PORT)

### CORS errors?
Make sure `FRONTEND_ORIGIN` is set to your Vercel URL in Railway environment variables.

### Database connection fails?
- Verify POSTGRES_URL is correct
- Check Neon dashboard for connection string
- Ensure SSL is enabled (`?sslmode=require`)

---

## After Deployment

Your setup will be:

```
Frontend (Vercel)
    ↓
    API calls to
    ↓
Backend (Railway) 
    ↓
    Connects to
    ↓
Database (Neon PostgreSQL)
```

**Everything works perfectly!** ✅

---

## Quick Start Checklist

- [ ] Sign up for Railway
- [ ] Connect GitHub repository
- [ ] Configure backend directory
- [ ] Add environment variables (copy from Vercel)
- [ ] Deploy backend
- [ ] Get Railway URL
- [ ] Update VITE_API_URL in Vercel
- [ ] Redeploy frontend
- [ ] Test all endpoints
- [ ] 🎉 Celebrate!

---

## Need Help?

Railway has excellent documentation:
- [Railway Docs](https://docs.railway.app/)
- [Node.js Guide](https://docs.railway.app/guides/nodejs)
- [Environment Variables](https://docs.railway.app/develop/variables)

---

**Time to complete**: 5-10 minutes  
**Difficulty**: Easy  
**Cost**: FREE  
**Result**: All features working! 🚀
