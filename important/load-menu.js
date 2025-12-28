document.addEventListener("DOMContentLoaded", () => {
  fetch("/important/menu.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("menu-container").innerHTML = html;
    })
    .catch(err => console.error("Menu failed to load:", err));
});
