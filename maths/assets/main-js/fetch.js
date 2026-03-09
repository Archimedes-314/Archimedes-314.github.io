document.addEventListener("DOMContentLoaded", () => {
  // Maths Menu
  fetch("/maths/assets/menu/menu.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("menu-container").innerHTML = html;
    })
    .catch(err => console.error("Menu failed to load:", err));

  // Maths Error List
  fetch("/maths/assets/asta-error-messages/error-list.html")
    .then(response => response.text())
    .then(html => {
      document.getElementById("error-container").innerHTML = html;
    })
    .catch(err => console.error("Error list failed to load:", err));
});