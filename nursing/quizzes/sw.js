const CACHE_NAME = "nursing-quiz-v2";
const ASSETS = [
  "/nursing/quizzes/",
  "/nursing/quizzes/app.html",
  "/nursing/quizzes/assets/CSS/index.css",
  "/nursing/quizzes/assets/CSS/style.css",
  "/nursing/quizzes/assets/JS/script.js",
  "/nursing/quizzes/assets/JS/dashboard.js",
  "/nursing/quizzes/assets/JS/quiz.js",
  "https://unpkg.com/react@18/umd/react.development.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.development.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
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
