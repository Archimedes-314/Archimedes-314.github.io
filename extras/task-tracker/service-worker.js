const CACHE_NAME = "roster-cache-v1";
const urlsToCache = [
  "/extras/task-tracker/",
  "/extras/task-tracker/index.html",
  "/extras/task-tracker/manifest.json",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Cache and Return Requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
