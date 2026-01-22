document.addEventListener("DOMContentLoaded", () => {
  fetch("/important/burger/menu.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("menu-container").innerHTML = html;
    })
    .catch(err => console.error("Menu failed to load:", err));
});


document.addEventListener("DOMContentLoaded", () => {
  fetch("/important/error-list/error-list.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("error-container").innerHTML = html;
    })
    .catch(err => console.error("Error list failed to load:", err));
});
