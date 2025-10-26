#!/usr/bin/env node
import 'dotenv/config';

const BASE = (process.env.VITE_API_URL || process.env.BASE_API_URL || 'https://luxury-perfume-haven.vercel.app/api').trim();

const request = async (path, opts = {}) => {
  const url = `${BASE}${path}`;
  const res = await fetch(url, opts);
  const txt = await res.text();
  let data;
  try { data = JSON.parse(txt); } catch { data = txt; }
  return { status: res.status, data };
};

(async () => {
  console.log('API base:', BASE);
  try {
    const cats = await request('/categories');
    if (cats.status === 200 && Array.isArray(cats.data)) {
      console.log('Categories:', cats.data.map(c => ({ id: c.id, slug: c.slug, name: c.name })).slice(0, 10));
    } else {
      console.error('Failed to fetch categories', cats);
      return;
    }

    const category = cats.data[0];
    if (!category) {
      console.error('No categories available to test');
      return;
    }

    console.log('\nUsing category:', { id: category.id, slug: category.slug, name: category.name });

    // Fetch products by category
    const byCat = await request(`/products?category=${encodeURIComponent(category.slug)}&limit=10`);
    console.log('\nGET /products?category=... result status:', byCat.status);
    if (Array.isArray(byCat.data.products) || Array.isArray(byCat.data)) {
      const productsList = Array.isArray(byCat.data.products) ? byCat.data.products : (Array.isArray(byCat.data) ? byCat.data : []);
      console.log('Products returned by category (count):', productsList.length);
      productsList.slice(0,5).forEach(p => console.log('- ', p.id, p.name, p.category));

      // If we have a product, take a word from its name to search
      const firstProduct = productsList[0];
      if (firstProduct && firstProduct.name) {
        const words = String(firstProduct.name).split(/\s+/).filter(Boolean);
        const query = words.length ? (words[0].length >= 2 ? words[0] : (words[1] || words[0])) : '';
        if (query.length >= 2) {
          console.log('\nSearching for query:', query);
          const searchRes = await request(`/products/search?q=${encodeURIComponent(query)}&limit=50`);
          console.log('Search status:', searchRes.status);
          const rawSearchResults = Array.isArray(searchRes.data) ? searchRes.data : (Array.isArray(searchRes.data.products) ? searchRes.data.products : []);
          console.log('Raw search results count:', rawSearchResults.length);
          const filtered = rawSearchResults.filter(p => p.category === category.slug);
          console.log('Filtered-by-category count (client-side):', filtered.length);
          filtered.slice(0,5).forEach(p => console.log('->', p.id, p.name, p.category));
        } else {
          console.log('First product name does not include a token suitable for search test');
        }
      }
    } else {
      console.log('No products returned for category, raw response:', byCat.data);
    }
  } catch (e) {
    console.error('Test failed', e);
  }
})();
