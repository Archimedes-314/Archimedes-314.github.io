if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/extras/todo-app/sw.js", {
      scope: "/extras/todo-app/",
    });
  });
}
