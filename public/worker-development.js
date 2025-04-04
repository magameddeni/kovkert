/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
// const CACHE_NAME = 'kovkert-cache'

// const PRECACHE_ASSETS = ['/']

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     (async () => {
//       const cache = await caches.open(CACHE_NAME)
//       cache.addAll(PRECACHE_ASSETS)
//     })()
//   )
// })

// self.addEventListener('activate', (event) => {
//   event.waitUntil(self.clients.claim())
// })

// self.addEventListener('fetch', (event) => {
//   event.respondWith(async () => {
//     const cache = await caches.open(CACHE_NAME)
//     const cachedResponse = await cache.match(event.request)
//     if (cachedResponse !== undefined) {
//       return cachedResponse
//     } else {
//       return fetch(event.request)
//     }
//   })
// })

self.addEventListener('push', async e => {
  const {
    message,
    body,
    icon,
    data
  } = JSON.parse(e.data.text());
  e.waitUntil(self.registration.showNotification(message, {
    body,
    icon,
    data
  }));
});
self.addEventListener('notificationclick', event => {
  var _event$notification, _event$notification$d;
  event.notification.close();
  const url = (_event$notification = event.notification) === null || _event$notification === void 0 ? void 0 : (_event$notification$d = _event$notification.data) === null || _event$notification$d === void 0 ? void 0 : _event$notification$d.url;
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(clientList => {
    for (const client of clientList) {
      if (client.url === '/' && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(url || '/');
  }));
});
/******/ })()
;