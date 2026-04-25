const { useState, useEffect } = React;

const App = () => {
  const [view, setView] = useState("home");

  useEffect(() => {
    const wrapper = document.getElementById("app-wrapper");
    if (view === "home") {
      wrapper.className = "theme-dashboard";
    } else {
      wrapper.className = "theme-quiz";
    }
  }, [view]);

  return (
    <div>
      {view === "home" ? (
        <Dashboard onStartQuiz={() => setView("quiz")} />
      ) : (
        <Quiz onBack={() => setView("home")} />
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => console.log(`Service Worker Registered: ${CACHE_NAME}`));
}

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = "block";
});

if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        installBtn.style.display = "none";
      }
      deferredPrompt = null;
    }
  });
}
