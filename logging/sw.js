const cacheName = "shift-log-cache-v1";
const assets = [
  "/logging",
  "/logging/st-john-logging.html", 
  "/logging/manifest.json"
];

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/logging/sw.js', { scope: '/logging/' })
    .then(() => console.log("Service Worker Registered"));
}

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(assets))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});