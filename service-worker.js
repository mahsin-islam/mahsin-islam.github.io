const CACHE = 'portfolio-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/blog.html',
  '/js/render-case-studies.js',
  '/data/case-studies.json',
  '/data/blogs.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      });
      return cached || fetched;
    })
  );
});
