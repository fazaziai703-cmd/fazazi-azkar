// Cache Version - IMPORTANT: Increment this version number whenever you make changes to the cached assets
const CACHE_VERSION = 'fazazi-azkar-v1.0.1'; // Changed from v1.0.0 to v1.0.1
const CACHE_NAME = CACHE_VERSION;

// List of URLs to cache
// This includes all the static assets of your application
const urlsToCache = [
  './', // Cache the root path (index.html)
  'index.html',
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
  'images/icon/fazazimedia.png', // New image path
  'https://fonts.googleapis.com/css2?family=Amiri&family=Noto+Naskh+Arabic&family=Lateefah&family=Scheherazade+New&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event: caches all the necessary assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker ...', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[Service Worker] Failed to cache:', error);
      })
  );
});

// Activate event: cleans up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker ...', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the service worker takes control of all clients immediately
  return self.clients.claim();
});

// Fetch event: serves cached content when available, otherwise fetches from network
self.addEventListener('fetch', (event) => {
  // Check if the request is for a navigation (HTML page)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If network fails, try to serve the offline page or root page
        return caches.match('index.html'); // Fallback to index.html for offline navigation
      })
    );
    return;
  }

  // For other assets (CSS, JS, images, fonts)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        // Cache new requests as they come in
        return caches.open(CACHE_NAME).then((cache) => {
          // Only cache valid responses
          if (fetchResponse.ok) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      }).catch((error) => {
        console.error('[Service Worker] Fetch failed:', error);
        // You can return a generic offline image or other fallback here for images/assets
        // For now, we'll just let it fail or return undefined
      });
    })
  );
});

// Optional: Message listener for communication between app and service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
