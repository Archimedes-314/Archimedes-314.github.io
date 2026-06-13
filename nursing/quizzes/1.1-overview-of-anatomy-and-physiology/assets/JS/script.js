const { useState, useEffect } = React;

const App = () => {
  const [currentQuiz, setCurrentQuiz] = useState(null);

  useEffect(() => {
    const wrapper = document.getElementById("app-wrapper");
    if (!currentQuiz) {
      wrapper.className = "theme-dashboard";
    } else {
      wrapper.className = "theme-quiz";
    }
  }, [currentQuiz]);

  return (
    <div>
      {!currentQuiz ? (
        <Dashboard onStartQuiz={(quizType) => setCurrentQuiz(quizType)} />
      ) : (
        <Quiz quizType={currentQuiz} onBack={() => setCurrentQuiz(null)} />
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
