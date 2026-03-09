window.addEventListener("DOMContentLoaded", () => {
  setupCollapsibleSections();
});


function setupCollapsibleSections(showByDefault = false) {
  document.querySelectorAll(".collapsible-section").forEach(section => {
    const content = section.querySelector(".section-content");
    const toggle = section.querySelector(".collapse-toggle");

    if (!content || !toggle) return;

    toggle.innerHTML = "▼";

    const open = showByDefault;
    section.classList.toggle("open", open);

    function setHeight() {
      const height = content.scrollHeight + "px";
      content.style.maxHeight = height;
      section.style.setProperty("--content-height", height);
    }

    if (open) {
      setHeight();
    }

    toggle.addEventListener("click", () => {
      const isOpen = section.classList.toggle("open");

      if (isOpen) {
        setHeight();
      } else {
        content.style.maxHeight = "0px";
      }
    });
  });
}

