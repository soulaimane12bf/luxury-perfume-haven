const fs = require('fs');
const path = require('path');

// Dynamic sitemap generator that fetches products and categories from backend API.
// Usage: BASE_URL=https://www.cosmedstores.com node scripts/generate-dynamic-sitemap.cjs

const API_BASE = process.env.BASE_API_URL || process.env.VITE_API_URL || 'https://www.cosmedstores.com/api';
const SITE_BASE = process.env.BASE_URL || 'https://www.cosmedstores.com';

async function fetchJson(url) {
  const res = await fetch(url, { method: 'GET' });
  if (!res.ok) {
    console.error('Failed to fetch', url, res.status);
    return null;
  }
  return res.json();
}

async function generate() {
  console.log('Using API base:', API_BASE);
  console.log('Using site base:', SITE_BASE);

  const routes = ['/', '/products', '/collection', '/contact', '/about', '/cart'];

  // Fetch categories
  try {
    const cats = await fetchJson(`${API_BASE}/categories`) || [];
    if (Array.isArray(cats)) {
      cats.forEach(c => {
        if (c && c.slug) routes.push(`/collection/${c.slug}`);
      });
    }
  } catch (e) {
    console.warn('Could not fetch categories:', e.message);
  }

  // Fetch products
  try {
    const productsResp = await fetchJson(`${API_BASE}/products`) || [];
    let products = productsResp;
    if (productsResp && typeof productsResp === 'object' && Array.isArray(productsResp.products)) {
      products = productsResp.products;
    }
    if (Array.isArray(products)) {
      products.forEach(p => {
        // product pages use id route /product/:id
        if (p && (p.id || p._id)) {
          const id = p.id || p._id;
          routes.push(`/product/${id}`);
        }
      });
    }
  } catch (e) {
    console.warn('Could not fetch products:', e.message);
  }

  // Deduplicate
  const uniq = Array.from(new Set(routes));

  const urlEntries = uniq.map(r => `  <url>\n    <loc>${SITE_BASE}${r}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

  const outDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log('sitemap.xml written to', outPath);
}

if (require.main === module) {
  generate().catch(err => { console.error(err); process.exit(1); });
}

module.exports = { generate };
