const CACHE_NAME = "nursing-app-v1";

const ASSETS = [
  // --- Main Landing & Global Assets ---
  "/nursing/",
  "/nursing/index.html",
  "/nursing/manifest.json",
  "/nursing/assets/CSS/style.css",
  "/nursing/assets/JS/login.js",

  // --- Quiz 1.1: Overview of Anatomy and Physiology ---
  "/nursing/quizzes/1.1-overview-of-anatomy-and-physiology/app.html",
  "/nursing/quizzes/1.1-overview-of-anatomy-and-physiology/assets/CSS/index.css",
  "/nursing/quizzes/1.1-overview-of-anatomy-and-physiology/assets/CSS/style.css",
  "/nursing/quizzes/1.1-overview-of-anatomy-and-physiology/assets/JS/breathing-basic.js",
  "/nursing/quizzes/1.1-overview-of-anatomy-and-physiology/assets/JS/dashboard.js",
  "/nursing/quizzes/1.1-overview-of-anatomy-and-physiology/assets/JS/script.js",

  // --- Quiz: Testing ---
  "/nursing/quizzes/testing/app.html",
  "/nursing/quizzes/testing/assets/CSS/index.css",
  "/nursing/quizzes/testing/assets/CSS/style.css",
  "/nursing/quizzes/testing/assets/JS/breathing-basic.js",
  "/nursing/quizzes/testing/assets/JS/dashboard.js",
  "/nursing/quizzes/testing/assets/JS/script.js",

  // --- Global React / Babel External CDN Dependencies ---
  "https://unpkg.com/react@18/umd/react.development.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.development.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map((url) => {
          return cache
            .add(url)
            .catch((err) =>
              console.error("Failed to cache root asset:", url, err),
            );
        }),
      );
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Cleaning up old cache:", key);
            return caches.delete(key);
          }
        }),
      );
    }),
  );

  self.clients.claim();
});

// Activate Event
// self.addEventListener("activate", (e) => {
//   e.waitUntil(
//     caches.keys().then((keys) => {
//       return Promise.all(
//         keys.map((key) => {
//           if (key !== CACHE_NAME) return caches.delete(key);
//         }),
//       );
//     }),
//   );
//   self.clients.claim();
// });

// Fetch Event
self.addEventListener("fetch", (e) => {
  // Ignore browser extensions
  if (
    !e.request.url.startsWith(self.location.origin) &&
    !e.request.url.startsWith("https://unpkg.com")
  ) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    }),
  );
});
