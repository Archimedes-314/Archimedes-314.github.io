const cacheName = "car-cache-v1";
const assets = [
  "/extras/car",
  "/extras/car/logging.html", 
  "/extras/car/manifest.json"
];

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/extras/car/sw.js', { scope: '/extras/car/' })
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.error("Failed to load service worker:", err));
}

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            console.log("Cleaning up old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

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