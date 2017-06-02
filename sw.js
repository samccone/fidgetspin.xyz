var VERSION = '8';

this.addEventListener('install', e => e.waitUntil(swInstall(e)));
this.addEventListener('activate', e => e.waitUntil(swActivate(e)));
this.addEventListener('fetch', e => e.respondWith(swFetch(e)));

async function swInstall(e) {
  const rs = await fetch('./bundle.txt');
  const body = await rs.text();
  const cache = await caches.open(VERSION);
  return cache.addAll(body.trim().split('\n'));
}

async function swActivate(e) {
  const keys = await caches.keys();
  for (var key of keys) {
    if (key !== VERSION)
      caches.delete(key);
  }
}

async function swFetch(e) {
  var networkFetch = fetchFromNetworkAndCache(e);
  const cache = await caches.open(VERSION);
  const response = await cache.match(e.request);
  if (response)
    return response;
  return networkFetch;
}

async function fetchFromNetworkAndCache(e) {
  const res = await fetch(e.request);
  if (!res.url) {
    // foreign requests will be res.type === 'opaque' and missing a url
    return res;
  }

  const cache = await caches.open(VERSION);
  // TODO: figure out if the content is new and therefore the page needs a reload.
  cache.put(e.request, res.clone());
  return res;
}
