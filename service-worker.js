// 🔄 Cache Version - bump this whenever assets change
const CACHE_VERSION = 'fazazi-azkar-v1.0.3';
const CACHE_NAME = CACHE_VERSION;

// 🌐 Offline fallback page
const OFFLINE_URL = 'offline.html';

// 📦 Assets to cache (local + external)
const urlsToCache = [
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
  console.log('[Service Worker] Installing:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('[SW] Failed to cache:', err))
  );
});

// 🚀 Activate: Remove old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating:', CACHE_NAME);
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Removing old cache:', key);
          return caches.delete(key);
        }
      })
    ))
  );
  return self.clients.claim();
});

// 🌍 Fetch: Serve from cache with fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Navigate requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Fonts & styles → cache first
  if (request.destination === 'style' || request.destination === 'font') {
    event.respondWith(
      caches.match(request).then(resp => {
        return resp || fetch(request).then(fetchResp => {
          if (fetchResp.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, fetchResp.clone()));
          }
          return fetchResp;
        });
      })
    );
    return;
  }

  // Other assets → cache with update
  event.respondWith(
    caches.match(request).then(resp => {
      return resp || fetch(request).then(fetchResp => {
        if (fetchResp.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, fetchResp.clone()));
        }
        return fetchResp;
      }).catch(err => {
        console.warn('[SW] Network failed:', err);
      });
    })
  );
});

// 🔁 Optional skipWaiting listener
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
