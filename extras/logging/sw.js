const cacheName = "shift-log-cache-v4";
const assets = [
  "/logging",
  "/logging/incident-reflection-app.html", 
  "/logging/manifest.json"
];

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/logging/sw.js', { scope: '/logging/' })
    .then(() => console.log("Service Worker Registered"));
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