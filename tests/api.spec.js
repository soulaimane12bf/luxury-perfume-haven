import { describe, it, expect } from 'vitest';

const BASE = (process.env.VITE_API_URL || process.env.BASE_API_URL || 'https://luxury-perfume-haven.vercel.app/api').trim();
const ADMIN_USER = (process.env.ADMIN_USERNAME || 'admin').trim();
const ADMIN_PASS = (process.env.ADMIN_PASSWORD || 'admintest').trim();

async function request(method, path, body = null, token = null) {
  const url = `${BASE}${path}`;
  const opts = { method, headers: {} };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body && typeof body === 'object') {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

describe('API smoke tests', () => {
  it('health should return OK', async () => {
    const h = await request('GET', '/health');
    expect(h.status).toBe(200);
    expect(h.data).toHaveProperty('status');
  });

  it('admin login should work', async () => {
    const login = await request('POST', '/auth/login', { username: ADMIN_USER, password: ADMIN_PASS });
    expect(login.status).toBe(200);
    expect(login.data).toHaveProperty('token');
  });
});
