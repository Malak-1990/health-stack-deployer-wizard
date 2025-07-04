const CACHE_NAME = 'healthstack-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // أضف المزيد من الأصول الهامة لاحقًا: CSS، JS، خطوط، إلخ.
];

// ✅ Cache عند التثبيت
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // يجعل SW نشطًا فورًا
});

// ✅ التحكم في الصفحات المفتوحة بعد التفعيل
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // حذف الإصدارات القديمة
          }
        })
      );
    })
  );
  self.clients.claim(); // يتحكم في كل الصفحات مباشرة
});

// ✅ استجابة للطلبات - استراتيجية cache-first
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // ⚡ تحميل من الكاش
      }

      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone()); // تحديث الكاش
          return networkResponse;
        });
      }).catch(() => {
        // يمكنك عرض صفحة fallback هنا في حالة عدم الاتصال
        return caches.match('/offline.html'); // إن وجدت
      });
    })
  );
});
