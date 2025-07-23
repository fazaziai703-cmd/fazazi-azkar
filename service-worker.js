// Cache Version - change this when updating assets
const CACHE_VERSION = 'fazazi-azkar-v1.0.2';
const CACHE_NAME = CACHE_VERSION;

// Offline fallback page
const OFFLINE_URL = 'offline.html';

// Assets to cache
const urlsToCache = [
  './',
  'index.html',
  'offline.html',
  'style.css',
  'script.js',
  'manifest.json',
  'images/icons/icon-72x72.png',
  'images/icons/icon-96x96.png',
  'images/icons/icon-128x128.png',
  'images/icons/icon-144x144.png',
  'images/icons/icon-152x152.png',
  'images/icons/icon-192x192.png',
  'images/icons/icon-384x384.png',
  'images/icons/icon-512x512.png',
  'images/icons/maskable-icon-192.png',
  'images/icons/maskable-icon-512.png',
  'images/icon/fazazimedia.png',
  'https://fonts.googleapis.com/css2?family=Amiri&family=Noto+Naskh+Arabic&family=Lateefah&family=Scheherazade+New&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install: Pre-cache everything
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching assets...');
      return cache.addAll(urlsToCache);
    }).catch((err) => {
      console.error('[Service Worker] Failed to cache:', err);
    })
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch: Serve from cache or fallback
self.addEventListener('fetch', (event) => {
  // HTML navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Style or font requests: cache first
  if (event.request.destination === 'style' || event.request.destination === 'font') {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp || fetch(event.request).then((fetchResp) => {
          return caches.open(CACHE_NAME).then((cache) => {
            if (fetchResp.ok) {
              cache.put(event.request, fetchResp.clone());
            }
            return fetchResp;
          });
        });
      })
    );
    return;
  }

  // Other assets
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((fetchResp) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (fetchResp.ok) {
            cache.put(event.request, fetchResp.clone());
          }
          return fetchResp;
        });
      }).catch((err) => {
        console.warn('[Service Worker] Network failed:', err);
      });
    })
  );
});

// Messaging support (optional)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
