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

// 1. Register the Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("Service Worker Registered"));
}

// 2. Handle the Install Prompt
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Show the install button
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
