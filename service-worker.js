const CACHE = 'portfolio-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/blog.html',
  '/work.html',
  '/services.html',
  '/products.html',
  '/js/common.js',
  '/js/render-case-studies.js',
  '/js/render-site-config.js',
  '/js/render-events.js',
  '/404.html',
  '/data/site-config.json',
  '/data/case-studies.json',
  '/data/blogs.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Only handle same-origin GETs. Never cache API calls, POSTs, or cross-origin.
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // JSON data files: network-first so edits appear immediately, cache fallback for offline.
  if (url.pathname.includes('/data/')) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Everything else same-origin: cache-first with background refresh.
  e.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
