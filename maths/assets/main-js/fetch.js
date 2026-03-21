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
    .then(() => {
      if (window.matchMedia("(max-width: 670px)").matches) {
        showError("screen")
      } else {
        hideError("screen")
      }
    })
    .catch(err => console.error("Error list failed to load:", err));

  // Maths Footer
  fetch("/maths/assets/asta-footer/footer.html")
    .then(response => response.text())
    .then(html => {
      const footerEl = document.querySelector("footer-div");
      footerEl.innerHTML = html;

      const dateAttr = footerEl.getAttribute("date");
      const dateEl = document.querySelector(".footer-down span");

      if (dateAttr) {
        dateEl.innerHTML = dateAttr;
      } else {
        dateEl.innerHTML= "I forgot to set a date; this is a placeholder.";
      }

    })
    .catch(err => console.error("Error list failed to load:", err));
});