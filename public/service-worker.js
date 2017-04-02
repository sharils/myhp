const CACHE_NAME = '1.0.0';
const assets = [
  '/',
  '/index.html',
];

const isntCacheName = cacheName => cacheName !== CACHE_NAME;

const toDeletePromise = cacheName => caches.delete(cacheName);

this.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
));

this.addEventListener('activate', e => e.waitUntil(
  caches.keys()
  .then(cacheNames => Promise.all(
    cacheNames.filter(isntCacheName).map(toDeletePromise)
  ))
));

this.addEventListener('fetch', e => e.respondWith(
  caches.match(e.request.clone(), {
    ignoreSearch: true,
  })
  .then(response => {
    if (response) {
      return response;
    }

    return fetch(e.request).then(r => {
      if (!r.ok) {
        return response;
      }

      caches.open(CACHE_NAME)
      .then(cache => cache.put(e.request.clone(), r.clone()))

      return r;
    });
  })
));
