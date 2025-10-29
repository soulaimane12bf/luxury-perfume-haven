const fs = require('fs');
const path = require('path');

// Minimal static sitemap generator.
// Edit the `routes` array below to include any dynamic pages or extend to fetch product slugs from API.

const BASE_URL = process.env.BASE_URL || 'https://www.cosmedstores.com';

const routes = [
  '/',
  '/products',
  '/collection',
  '/contact',
  '/about',
  '/admin',
  '/cart'
];

function formatUrl(loc, priority = '0.8', changefreq = 'weekly') {
  return `  <url>\n    <loc>${BASE_URL}${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function generate() {
  const now = new Date().toISOString();
  const urls = routes.map(r => formatUrl(r)).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  const outDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log('sitemap.xml written to', outPath);
}

if (require.main === module) generate();

module.exports = { generate };
