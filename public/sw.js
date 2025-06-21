// public/sw.js

const CACHE_NAME = 'healthstack-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Add more asset URLs as needed (CSS, JS, fonts, etc.)
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(resp => {
          return caches.open(CACHE_NAME).then(cache => {
            // Only cache OK responses
            if (resp.status === 200 && resp.type === 'basic') {
              cache.put(event.request, resp.clone());
            }
            return resp;
          });
        })
      );
    })
  );
});
