// Minimal SW to take control and then get out of the way
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Take control immediately so old SW stops intercepting
    try { await self.clients.claim(); } catch(e) {}
    // Clear all caches that might have been created by previous SWs
    try {
      if (self.caches && caches.keys) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {}
    // Unregister this SW after claiming clients; we don't want any SW
    try { await self.registration.unregister(); } catch(e) {}
  })());
});

// Pure pass-through for all requests
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});


