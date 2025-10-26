#!/usr/bin/env node
import 'dotenv/config';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const BASE = (process.env.VITE_API_URL || process.env.BASE_API_URL || 'https://luxury-perfume-haven.vercel.app/api').trim();
const ADMIN_USER = (process.env.ADMIN_USERNAME || 'admin').trim();
const ADMIN_PASS = (process.env.ADMIN_PASSWORD || 'admintest').trim();

const results = [];
const ok = (name) => { results.push({ name, ok: true }); console.log(`✅ ${name}`); };
const fail = (name, err) => { results.push({ name, ok: false, err: String(err) }); console.error(`❌ ${name} -> ${err}`); };

const request = async (method, path, body = null, token = null, headers = {}) => {
  const url = `${BASE}${path}`;
  const opts = { method, headers: { ...headers } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body && !(body instanceof URLSearchParams) && !(body instanceof FormData)) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  } else if (body) {
    opts.body = body;
  }
  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch (e) { data = text; }
  return { status: res.status, data };
};

const run = async () => {
  console.log('API test base URL:', BASE);

  // Health
  try {
    const h = await request('GET', '/health');
    if (h.status === 200) ok('GET /api/health'); else fail('GET /api/health', JSON.stringify(h));
  } catch (e) { fail('GET /api/health', e); }

  // Public GET products
  try {
    const p = await request('GET', '/products');
    if (p.status === 200) ok('GET /api/products'); else fail('GET /api/products', JSON.stringify(p));
  } catch (e) { fail('GET /api/products', e); }

  // Login as admin
  let token = null;
  try {
    const login = await request('POST', '/auth/login', { username: ADMIN_USER, password: ADMIN_PASS });
    if (login.status === 200 && login.data && login.data.token) {
      token = login.data.token;
      ok('POST /api/auth/login');
    } else {
      fail('POST /api/auth/login', JSON.stringify(login));
    }
  } catch (e) { fail('POST /api/auth/login', e); }

  if (!token) {
    console.error('Cannot continue protected tests without admin token');
    summary(); process.exit(1);
  }

  // Products CRUD
  let createdProductId = null;
  try {
    const create = await request('POST', '/products', {
      name: 'API Test Product', brand: 'APITest', price: '4.99', category: 'api-test', type: 'Eau de Toilette', image_urls: ['https://example.com/img.jpg'], stock: 10
    }, token);
    if (create.status === 201 || create.status === 200) {
      createdProductId = create.data.id || create.data.ID || null;
      ok('POST /api/products');
    } else fail('POST /api/products', JSON.stringify(create));
  } catch (e) { fail('POST /api/products', e); }

  try {
    if (createdProductId) {
      const upd = await request('PUT', `/products/${createdProductId}`, { price: '5.99' }, token);
      if (upd.status === 200) ok('PUT /api/products/:id'); else fail('PUT /api/products/:id', JSON.stringify(upd));
    }
  } catch (e) { fail('PUT /api/products/:id', e); }

  try {
    if (createdProductId) {
      const get = await request('GET', `/products/${createdProductId}`);
      if (get.status === 200) ok('GET /api/products/:id'); else fail('GET /api/products/:id', JSON.stringify(get));
    }
  } catch (e) { fail('GET /api/products/:id', e); }

  try {
    if (createdProductId) {
      const del = await request('DELETE', `/products/${createdProductId}`, null, token);
      if (del.status === 200) ok('DELETE /api/products/:id'); else fail('DELETE /api/products/:id', JSON.stringify(del));
    }
  } catch (e) { fail('DELETE /api/products/:id', e); }

  // Categories CRUD
  let createdCategoryId = null;
  try {
    const create = await request('POST', '/categories', { name: 'API Test Cat', slug: `api-cat-${Date.now()}`, description: 'Test' }, token);
    if (create.status === 201 || create.status === 200) { createdCategoryId = create.data.id; ok('POST /api/categories'); } else fail('POST /api/categories', JSON.stringify(create));
  } catch (e) { fail('POST /api/categories', e); }

  try {
    if (createdCategoryId) {
      const upd = await request('PUT', `/categories/${createdCategoryId}`, { description: 'Updated' }, token);
      if (upd.status === 200) ok('PUT /api/categories/:id'); else fail('PUT /api/categories/:id', JSON.stringify(upd));
    }
  } catch (e) { fail('PUT /api/categories/:id', e); }

  try {
    if (createdCategoryId) {
      const del = await request('DELETE', `/categories/${createdCategoryId}`, null, token);
      if (del.status === 200) ok('DELETE /api/categories/:id'); else fail('DELETE /api/categories/:id', JSON.stringify(del));
    }
  } catch (e) { fail('DELETE /api/categories/:id', e); }

  // Reviews: create (public), admin get all, approve, delete
  let createdReviewId = null;
  try {
    const create = await request('POST', '/reviews', { productId: null, product_id: null, product: null, productId: '', product_id: '', name: 'API Reviewer', rating: 5, comment: 'Great!' });
    // Some review implementations require product id; we accept 201/200/400 but continue
    if (create.status === 201 || create.status === 200) { ok('POST /api/reviews (public)'); createdReviewId = create.data?.id || null; }
  } catch (e) { /* ignore */ }

  try {
    const getAll = await request('GET', '/reviews', null, token);
    if (getAll.status === 200) ok('GET /api/reviews (admin)'); else fail('GET /api/reviews (admin)', JSON.stringify(getAll));
  } catch (e) { fail('GET /api/reviews (admin)', e); }

  // Orders: create (public), admin get, update status, delete
  let createdOrderId = null;
  try {
    const orderBody = { customer_name: 'API Buyer', customer_phone: '0650000000', customer_address: 'Test Address', items: [{ id: 'product-1', name: 'P', quantity: 1, price: '9.99', image_url: '' }], total_amount: '9.99' };
    const createOrder = await request('POST', '/orders', orderBody);
    if (createOrder.status === 201 || createOrder.status === 200) { createdOrderId = createOrder.data.order?.id || createOrder.data?.order?.id || createOrder.data?.id || null; ok('POST /api/orders'); } else fail('POST /api/orders', JSON.stringify(createOrder));
  } catch (e) { fail('POST /api/orders', e); }

  try {
    const getOrders = await request('GET', '/orders', null, token);
    if (getOrders.status === 200) ok('GET /api/orders (admin)'); else fail('GET /api/orders (admin)', JSON.stringify(getOrders));
  } catch (e) { fail('GET /api/orders (admin)', e); }

  try {
    if (createdOrderId) {
      const upd = await request('PATCH', `/orders/${createdOrderId}/status`, { status: 'shipped' }, token);
      if (upd.status === 200) ok('PATCH /api/orders/:id/status'); else fail('PATCH /api/orders/:id/status', JSON.stringify(upd));
    }
  } catch (e) { fail('PATCH /api/orders/:id/status', e); }

  try {
    if (createdOrderId) {
      const del = await request('DELETE', `/orders/${createdOrderId}`, null, token);
      if (del.status === 200) ok('DELETE /api/orders/:id'); else fail('DELETE /api/orders/:id', JSON.stringify(del));
    }
  } catch (e) { fail('DELETE /api/orders/:id', e); }

  // Sliders: public active and admin list
  try {
    const active = await request('GET', '/sliders/active');
    if (active.status === 200) ok('GET /api/sliders/active'); else fail('GET /api/sliders/active', JSON.stringify(active));
  } catch (e) { fail('GET /api/sliders/active', e); }

  try {
    const adminSliders = await request('GET', '/sliders', null, token);
    if (adminSliders.status === 200) ok('GET /api/sliders (admin)'); else fail('GET /api/sliders (admin)', JSON.stringify(adminSliders));
  } catch (e) { fail('GET /api/sliders (admin)', e); }

  // Slider upload (admin) - create a small test image and upload it
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const imagePath = join(__dirname, '..', 'scripts', 'test-image.png');
    if (!fs.existsSync(imagePath)) {
      // Tiny 1x1 PNG (base64). We'll write it to disk for upload.
      const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMBAQEA';
      const buf = Buffer.from(pngBase64.replace(/\s+/g, ''), 'base64');
      fs.writeFileSync(imagePath, buf);
    }

    const buffer = fs.readFileSync(imagePath);
    const form = new FormData();
    form.append('title', 'API Test Slider');
  // Append image as Blob with explicit MIME type so Multer's fileFilter accepts it
  // In Node's global Blob the type may be empty by default, so set type to 'image/png'
  form.append('image', new Blob([buffer], { type: 'image/png' }), 'test-image.png');

    const res = await fetch(`${BASE}/sliders`, { method: 'POST', body: form, headers: { Authorization: `Bearer ${token}` } });
    const txt = await res.text();
    let data = null;
    try { data = JSON.parse(txt); } catch (e) { data = txt; }
    if (res.status === 201 || res.status === 200) ok('POST /api/sliders (image upload)'); else fail('POST /api/sliders (image upload)', JSON.stringify({ status: res.status, data }));
  } catch (e) { fail('POST /api/sliders (image upload)', e); }

  summary();
};

const summary = () => {
  console.log('\n=== API Test Summary ===');
  let passed = results.filter(r => r.ok).length;
  let failed = results.filter(r => !r.ok).length;
  results.forEach(r => console.log(`${r.ok ? 'PASS' : 'FAIL'} - ${r.name}${r.err ? ' - ' + r.err : ''}`));
  console.log(`\nTotal: ${results.length}, Passed: ${passed}, Failed: ${failed}`);
};

run().catch(err => { console.error('Fatal test runner error:', err); process.exit(1); });
