window.addEventListener("DOMContentLoaded", () => {
  setupCollapsibleSections(
    document.documentElement.classList.contains("show-sections")
  );
});



function setupCollapsibleSections(showByDefault = false) {
  document.querySelectorAll(".collapsible-section").forEach(section => {
    const content = section.querySelector(".section-content");
    const toggle = section.querySelector(".collapse-toggle");

    toggle.innerHTML = "▼"

    if (!content || !toggle) return;

    const open = showByDefault;
    section.classList.toggle("open", open);

    if (open) {
      content.style.maxHeight = content.scrollHeight + "px";
      section.style.setProperty(
        "--content-height",
        content.scrollHeight + "px"
      );
    }

    toggle.addEventListener("click", () => {
      const isOpen = section.classList.toggle("open");

      if (isOpen) {
        content.style.maxHeight = content.scrollHeight + "px";
        section.style.setProperty(
          "--content-height",
          content.scrollHeight + "px"
        );
      } else {
        content.style.maxHeight = "0px";
      }
    });
  });
}

