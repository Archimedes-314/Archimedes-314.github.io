function switchYear(year) {
  const sections = document.querySelectorAll(".year-section");
  sections.forEach((section) => section.classList.remove("active"));

  const buttons = document.querySelectorAll(".year-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  document.getElementById("section-" + year).classList.add("active");

  event.target.classList.add("active");
}
