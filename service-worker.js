// 🔄 Cache Version - bump this whenever assets change
const CACHE_VERSION = 'fazazi-azkar-v1.1.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

// 🌐 Offline fallback page
const OFFLINE_URL = 'offline.html';

// 📦 Assets to cache (local + external)
const STATIC_ASSETS = [
  './fazazi-azkar/',
  'index.html',
  'offline.html',
  'style.css',
  'script.js',
  'manifest.json',
  // 📁 Icons
  'images/icons/icon-192x192.png',
  'images/icons/icon-512x512.png',
  'images/icons/maskable-icon-192.png',
  'images/icons/maskable-icon-512.png',
  // 🖼️ Branding Images
  'images/icon/fazazimedia.png',
  'images/backgrounds/islamic-gradient.png',
  // 🌐 External assets
  'https://fonts.googleapis.com/css2?family=Amiri&family=Noto+Naskh+Arabic&family=Lateefah&family=Scheherazade+New&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// 🔧 Install: Cache all core assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .catch(err => console.error('[SW] Failed to cache:', err))
  );
});

// 🚀 Activate: Remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// 🌍 Fetch: Serve from cache, update in background (stale-while-revalidate)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ALWAYS serve offline.html for failed navigations
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          // Optionally cache new HTML
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          return caches.match(request).then(resp => resp || caches.match(OFFLINE_URL));
        }
      })()
    );
    return;
  }

  // Fonts & styles → cache first
  if (request.destination === 'style' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then(resp => {
        return resp || fetch(request).then(fetchResp => {
          if (fetchResp.ok) {
            caches.open(STATIC_CACHE).then(cache => cache.put(request, fetchResp.clone()));
          }
          return fetchResp;
        }).catch(() => undefined);
      })
    );
    return;
  }

  // Other assets → cache first, update in background
  event.respondWith(
    caches.match(request).then(resp => {
      const fetchPromise = fetch(request).then(fetchResp => {
        if (fetchResp.ok) {
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, fetchResp.clone()));
        }
        return fetchResp;
      }).catch(() => resp);
      return resp || fetchPromise;
    })
  );
});

// 🔁 Optional skipWaiting listener
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 📢 Push Notifications (optional, ready for use)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'تطبيق الأذكار';
  const options = {
    body: data.body || 'لا تنس ذكر الله اليوم!',
    icon: 'images/icons/icon-192x192.png',
    badge: 'images/icons/icon-192x192.png',
    data: data.url || '/'
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});