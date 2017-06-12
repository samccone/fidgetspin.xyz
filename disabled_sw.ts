// TODO(samccone) figure out how to get the real types working.

interface ExtendableEvent {
  waitUntil: any;
  respondWith: any;
  request: any;
}

var VERSION = '13';

this.addEventListener('install', (e: ExtendableEvent) =>
  e.waitUntil(swInstall())
);
this.addEventListener('activate', (e: ExtendableEvent) =>
  e.waitUntil(swActivate())
);
this.addEventListener('fetch', (e: ExtendableEvent) =>
  e.respondWith(swFetch(e))
);

async function swInstall() {
  const rs = await fetch('./bundle.txt');
  const body = await rs.text();
  const cache = await caches.open(VERSION);
  await cache.addAll(body.trim().split('\n'));
  await this.skipWaiting();
}

async function swActivate() {
  const keys = await caches.keys();
  let deletes = [];

  for (var key of keys) {
    if (key !== VERSION) deletes.push(caches.delete(key));
  }

  await Promise.all(deletes);
  await this.clients.claim();
}

async function swFetch(e: ExtendableEvent) {
  var networkFetch = fetchFromNetworkAndCache(e);
  const cache = await caches.open(VERSION);
  const response = await cache.match(e.request);
  if (response) return response;
  return networkFetch;
}

async function fetchFromNetworkAndCache(e: ExtendableEvent) {
  if (new URL(e.request.url).origin !== location.origin) {
    return new Response(new Blob(), { status: 404, statusText: 'Not found' });
  }

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
