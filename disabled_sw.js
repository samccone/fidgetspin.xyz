goog.module('disabled_sw'); exports = {}; var module = {id: 'disabled_sw.js'};/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */
function ExtendableEvent() { }
/** @type {?} */
ExtendableEvent.prototype.waitUntil;
/** @type {?} */
ExtendableEvent.prototype.respondWith;
/** @type {?} */
ExtendableEvent.prototype.request;
var /** @type {?} */ VERSION = '13';
this.addEventListener('install', (e) => e.waitUntil(swInstall()));
this.addEventListener('activate', (e) => e.waitUntil(swActivate()));
this.addEventListener('fetch', (e) => e.respondWith(swFetch(e)));
/**
 * @return {?}
 */
async function swInstall() {
    const /** @type {?} */ rs = await fetch('./bundle.txt');
    const /** @type {?} */ body = await rs.text();
    const /** @type {?} */ cache = await caches.open(VERSION);
    await cache.addAll(body.trim().split('\n'));
    await this.skipWaiting();
}
/**
 * @return {?}
 */
async function swActivate() {
    const /** @type {?} */ keys = await caches.keys();
    let /** @type {?} */ deletes = [];
    for (var /** @type {?} */ key of keys) {
        if (key !== VERSION)
            deletes.push(caches.delete(key));
    }
    await Promise.all(deletes);
    await this.clients.claim();
}
/**
 * @param {?} e
 * @return {?}
 */
async function swFetch(e) {
    var /** @type {?} */ networkFetch = fetchFromNetworkAndCache(e);
    const /** @type {?} */ cache = await caches.open(VERSION);
    const /** @type {?} */ response = await cache.match(e.request);
    if (response)
        return response;
    return networkFetch;
}
/**
 * @param {?} e
 * @return {?}
 */
async function fetchFromNetworkAndCache(e) {
    if (new URL(e.request.url).origin !== location.origin) {
        return new Response(new Blob(), { status: 404, statusText: 'Not found' });
    }
    const /** @type {?} */ res = await fetch(e.request);
    if (!res.url) {
        // foreign requests will be res.type === 'opaque' and missing a url
        return res;
    }
    const /** @type {?} */ cache = await caches.open(VERSION);
    // TODO: figure out if the content is new and therefore the page needs a reload.
    cache.put(e.request, res.clone());
    return res;
}
//# sourceMappingURL=data:application/json;base64,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