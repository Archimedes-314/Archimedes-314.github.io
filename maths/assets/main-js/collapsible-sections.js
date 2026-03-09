window.addEventListener("DOMContentLoaded", () => {
  setupCollapsibleSections();
});

function setHeight(section, content) {
  content.style.maxHeight = content.scrollHeight + "px";
  section.style.setProperty(
    "--content-height",
    content.scrollHeight + "px"
  );
}

function setupCollapsibleSections(showByDefault = false) {
  document.querySelectorAll(".collapsible-section").forEach(section => {
    const content = section.querySelector(".section-content");
    const toggle = section.querySelector(".collapse-toggle");
    toggle.innerHTML = "▼"

    const open = showByDefault;
    section.classList.toggle("open", open);

    if (open) {
      setHeight(section, content)
    }

    toggle.addEventListener("click", () => {
      const isOpen = section.classList.toggle("open");

      if (isOpen) {
        setHeight(section, content)
      } else {
        content.style.maxHeight = "0px";
      }
    });
  });
}

