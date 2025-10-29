const sitemapUrl = process.env.SITEMAP_URL || 'https://www.cosmedstores.com/sitemap.xml';
const urls = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  `https://www.bing.com/webmaster/ping.aspx?siteMap=${encodeURIComponent(sitemapUrl)}`,
];

async function ping(u) {
  try {
    const res = await fetch(u);
    console.log(u, res.status);
  } catch (e) {
    console.error('Failed ping', u, e.message);
  }
}

(async () => {
  for (const u of urls) await ping(u);
})();
