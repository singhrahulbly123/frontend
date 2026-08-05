const CACHE_NAME = 'pulsevian-pwa-v6';
const IS_LOCAL_HOST = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';
const ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/pulsevian-logo.svg',
  '/offline.html',
];

self.addEventListener('install', (event) => {
  if (IS_LOCAL_HOST) {
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  if (IS_LOCAL_HOST) {
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.filter((key) => key.startsWith('pulsevian-pwa-')).map((key) => caches.delete(key))))
        .then(() => self.registration.unregister())
    );
    return;
  }

  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (IS_LOCAL_HOST) {
    return;
  }

  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }

  // Next.js development chunks use stable filenames. Caching them can hydrate
  // a new server-rendered tree with an older client bundle after Fast Refresh.
  // Production chunks are content-hashed, so the browser/Next cache is enough.
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/api/')) {
    return;
  }

  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return cacheResponse || fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return networkResponse;
      }).catch(() => caches.match('/offline.html'));
    })
  );
});
