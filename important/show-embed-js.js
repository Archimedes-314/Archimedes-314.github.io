document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("togglePdfBtn");
  const iconPath = btn.querySelector("svg path");
  const text = btn.querySelector(".header-btn-text");
  const pdf = document.getElementById("pdfContainer");

  btn.addEventListener("click", () => {
    const isOpen = !pdf.hasAttribute("hidden");

    pdf.toggleAttribute("hidden");
    btn.setAttribute("aria-expanded", String(!isOpen));

    text.textContent = isOpen ? "Show PDF" : "Hide PDF";

    iconPath.setAttribute(
      "d",
      isOpen
        ? "M12 5v14M5 12h14" // plus
        : "M5 12h14"        // minus
    );
  });
});
