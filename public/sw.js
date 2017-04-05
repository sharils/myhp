const CACHE_NAME = '1.0.0';
const assets = [
  '/',
  '/index.html',
  '/index.js',
];

const isntCacheName = cacheName => cacheName !== CACHE_NAME;

const toDeletePromise = cacheName => caches.delete(cacheName);

const cacheAssets = async function() {
  const cache = await caches.open(CACHE_NAME);

  return cache => cache.addAll(assets);
}

const cachePair = async function(request, response) {
  const cache = await caches.open(CACHE_NAME);

  return cache.put(request, response);
};

const fetchCached = async function(request) {
  const cached = await caches.match(request.clone(), {
    ignoreSearch: true,
  });
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (!response.ok) {
    return cached;
  }

  return Promise.race(
    response,
    cachePair(request.clone(), response.clone())
  );
};

const evictCache = async function() {
  const cacheNames = await caches.keys();

  return Promise.all(
    cacheNames.filter(isntCacheName).map(toDeletePromise)
  );
};

this.addEventListener('install', e => e.waitUntil(cacheAssets()));

this.addEventListener('activate', e => e.waitUntil(evictCache()));

this.addEventListener('fetch', e => e.respondWith(fetchCached(e.request)));
