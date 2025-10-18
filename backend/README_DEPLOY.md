# Backend Deployment Guide

Prepare the Express + Sequelize API for production hosting (Render, Railway, VPS, etc.).

## Required Environment Variables

Provide these variables through your hosting provider:

- `PORT` – default `5000`
- `NODE_ENV` – set to `production`
- `FRONTEND_ORIGIN` – the exact origin of your deployed frontend (e.g. `https://YOUR_FRONTEND_DOMAIN`)
- `DB_URL` *or* (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`)
- `DB_USE_SSL` – set to `true` when your provider requires TLS (PlanetScale, Railway, etc.)
- `JWT_SECRET` – strong, random secret
- `JWT_EXPIRES_IN` – e.g. `24h`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` – SMTP credentials used for order notifications
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_WHATSAPP` – fallback admin account details
- `SEED` – usually `false` in production to avoid re-seeding on boot

## Deployment Steps

```bash
npm ci
npm run build
npm start
```

- `npm ci` installs exact dependency versions.
- `npm run build` runs any prestart compilation (currently a no-op but keeps parity with most hosts).
- `npm start` boots `server.js`, which loads environment variables, connects to the database, and starts the API.

## CORS & Frontend Integration

- Set `FRONTEND_ORIGIN` to your frontend’s public URL so CORS allows browser calls.
- The frontend should expose `VITE_API_URL=https://YOUR_BACKEND_DOMAIN/api` so it reaches this API.

## Database Configuration Notes

- Prefer the single `DB_URL` form offered by managed services like PlanetScale or Railway.
- When using discrete credentials, ensure the host allows remote connections and that firewall rules permit your platform.
- Enable `DB_USE_SSL=true` when your provider requires TLS.

## Seeding

- The API seeds default data only when `SEED === 'true'`.
- Leave `SEED=false` in production to avoid overwriting live data. Enable temporarily if you need to bootstrap a fresh environment.

## Health Check

- `GET https://YOUR_BACKEND_DOMAIN/api/health` verifies the process is running and attempts a database connection.

## Logging & Monitoring

- Review your platform’s logs for the "Database tables synchronized" message on boot.
- Database connection issues are logged but do not crash the process; API endpoints will return HTTP 500 until connectivity is restored.
