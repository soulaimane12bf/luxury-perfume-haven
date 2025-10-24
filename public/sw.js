// Simple service worker for API caching
const CACHE_NAME = 'api-cache-v1';
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only cache API GET requests
  if (event.request.method === 'GET' && url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            const cacheTime = new Date(cachedResponse.headers.get('sw-cache-time'));
            const now = new Date();
            
            // Return cached if less than 5 minutes old
            if (now - cacheTime < API_CACHE_DURATION) {
              return cachedResponse;
            }
          }
          
          // Fetch from network
          return fetch(event.request).then((response) => {
            if (response.ok) {
              const responseToCache = response.clone();
              const headers = new Headers(responseToCache.headers);
              headers.set('sw-cache-time', new Date().toISOString());
              
              const modifiedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers
              });
              
              cache.put(event.request, modifiedResponse);
            }
            return response;
          });
        });
      })
    );
  }
});
