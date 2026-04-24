const CACHE_NAME = "nursing-quiz-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/assets/CSS/index.css",
  "/assets/CSS/style.css",
  "/nursing/quizzes/assets/JS/script.js",
  "/nursing/quizzes/assets/JS/dashboard.js",
  "/nursing/quizzes/assets/JS/quiz.js",
];

// Install: Cache all assets
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// Fetch: Serve from cache if offline
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    }),
  );
});
