// Define a cache name for your assets. This helps manage different versions of your cache.
const CACHE_NAME = 'azkar-app-cache-v1.0.0';

// List all the files that your PWA needs to function offline.
// This includes HTML, CSS, JavaScript, manifest, and any images.
const urlsToCache = [
  '/fazazi-azkar/', // The root of your application
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'images/icons/icon-192x192.png', // Main PWA icon
  'images/icons/icon-512x512.png', // Another PWA icon (if you have it)
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', // Font Awesome CSS
  'https://fonts.googleapis.com/css2?family=Amiri&family=Noto+Naskh+Arabic&family=Lateefah&family=Scheherazade+New&display=swap', // Google Fonts CSS
  // Add the Fazazi Media image URL here
  'https://lh3.googleusercontent.com/u/0/drive-viewer/AFoagU9545sC44c15fb2-9ad1-43a7-8224-59784aa6558f=w1920-h937' // Fazazi Media Image
];

// --- Install Event ---
// This event is fired when the Service Worker is first installed.
// It's typically used to cache all the essential assets for offline use.
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache); // Add all specified URLs to the cache
      })
      .catch((error) => {
        console.error('[Service Worker] Failed to cache during install:', error);
      })
  );
});

// --- Fetch Event ---
// This event is fired every time the browser requests a resource.
// It intercepts network requests and serves content from the cache if available,
// otherwise, it fetches from the network.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request) // Try to find the request in the cache
      .then((response) => {
        // If a response is found in the cache, return it
        if (response) {
          console.log(`[Service Worker] Serving from cache: ${event.request.url}`);
          return response;
        }
        // If not found in cache, fetch from the network
        console.log(`[Service Worker] Fetching from network: ${event.request.url}`);
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse; // Return non-cacheable responses directly
            }

            // Clone the response because it's a stream and can only be consumed once
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache); // Put the new response in cache
              });
            return networkResponse; // Return the network response
          })
          .catch((error) => {
            console.error(`[Service Worker] Fetch failed for: ${event.request.url}`, error);
            // You can return a fallback page here for offline scenarios if needed
            // For example: return caches.match('/offline.html');
          });
      })
  );
});

// --- Activate Event ---
// This event is fired when the Service Worker is activated.
// It's commonly used to clean up old caches, ensuring only the latest version is kept.
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});
