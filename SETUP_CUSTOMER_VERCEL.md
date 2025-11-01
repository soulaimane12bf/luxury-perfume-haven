# Customer Vercel Setup Guide

## Environment Variables to Add

After customer gives you access to their Vercel account, add these environment variables:

### 1. Database (Supabase)
```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

### 2. Authentication & Security
```bash
JWT_SECRET=generate-strong-32-char-secret-key
JWT_EXPIRES_IN=24h
NODE_ENV=production
```

### 3. Frontend Configuration
```bash
FRONTEND_ORIGIN=https://www.cosmedstores.com
FRONTEND_ORIGINS=https://cosmedstores.com,https://www.cosmedstores.com
```

### 4. Admin Credentials (Customer's Info)
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=customer-chooses-secure-password
ADMIN_EMAIL=customer-email@example.com
ADMIN_WHATSAPP=212XXXXXXXXX
```

### 5. Email Configuration (Customer's SMTP)
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=customer-email@gmail.com
EMAIL_PASS=app-password-from-gmail
```

### 6. Optional (if using Vercel Blob)
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_token
```

---

## How to Add Variables in Vercel

1. Go to: https://vercel.com/[customer-username]/luxury-perfume-haven/settings/environment-variables
2. Click **"Add New"**
3. Enter **Key** and **Value**
4. Select **Production**, **Preview**, and **Development**
5. Click **Save**
6. Repeat for all variables above

---

## After Adding Variables

Redeploy the project:
```bash
# From Vercel dashboard: Deployments → [Latest] → Redeploy
# OR from CLI (after logging into customer's account):
vercel --prod
```

---

## Domain Configuration (Cloudflare)

### Customer adds domain in Vercel:
1. Vercel → Settings → Domains
2. Add: `www.cosmedstores.com` and `cosmedstores.com`

### Customer configures DNS in Cloudflare:
1. Cloudflare → DNS → Records
2. Add CNAME record:
   - **Type**: CNAME
   - **Name**: www
   - **Target**: cname.vercel-dns.com
   - **Proxy**: OFF (orange cloud)

3. Add A record for root domain:
   - **Type**: A
   - **Name**: @
   - **Target**: 76.76.21.21
   - **Proxy**: OFF

### Customer invites you as Super Admin in Cloudflare:
1. Cloudflare → Manage Account → Members
2. Invite your email with **Super Administrator** role

---

## Final Checklist

- [ ] Customer created GitHub, Vercel, Supabase, Cloudflare accounts
- [ ] Repository transferred to customer's GitHub
- [ ] You added as collaborator on GitHub (Admin)
- [ ] Project deployed on customer's Vercel
- [ ] You added as team member on Vercel (Owner/Admin)
- [ ] Customer created Supabase project
- [ ] You added as team member on Supabase (Admin)
- [ ] All environment variables added in Vercel
- [ ] Domain configured in Cloudflare
- [ ] You invited as Super Admin in Cloudflare
- [ ] Site tested and working at www.cosmedstores.com

---

## Support & Maintenance

Once setup is complete:
- You can deploy updates via GitHub push
- Customer pays for any Vercel/Supabase upgrades
- You maintain code and deployments
- Customer manages business (products, orders)
