if (localStorage.getItem("reducedMotion") === null) {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  localStorage.setItem("reducedMotion", prefersReduced);
}

// Initialize "showWorking" if it hasn't been set yet
if (localStorage.getItem("showWorking") === null) {
  localStorage.setItem("showWorking", false); // default: hidden
}

document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const reducedMotionToggle = document.getElementById("reducedMotionToggle");
  const showWorkingToggle = document.getElementById("showWorkingToggle");

  const settings = {
    darkMode: localStorage.getItem("darkMode") === "true",
    reducedMotion: localStorage.getItem("reducedMotion") === "true",
    showWorking: localStorage.getItem("showWorking") === "true"
  };

  if (settings.darkMode) {
    document.documentElement.classList.add("dark");
  }

  if (settings.reducedMotion) {
    document.documentElement.classList.add("reduced-motion");
  }

  if (settings.showWorking) {
    document.documentElement.classList.add("show-working");
  }

  if (darkModeToggle) {
    darkModeToggle.checked = settings.darkMode;

    darkModeToggle.addEventListener("change", () => {
      localStorage.setItem("darkMode", darkModeToggle.checked);
      document.documentElement.classList.toggle("dark", darkModeToggle.checked);
    });
  }

  if (reducedMotionToggle) {
    reducedMotionToggle.checked = settings.reducedMotion;

    reducedMotionToggle.addEventListener("change", () => {
      localStorage.setItem("reducedMotion", reducedMotionToggle.checked);
      document.documentElement.classList.toggle(
        "reduced-motion",
        reducedMotionToggle.checked
      );
    });
  }

  if (showWorkingToggle) {
    showWorkingToggle.checked = settings.showWorking;

    showWorkingToggle.addEventListener("change", () => {
      const enabled = showWorkingToggle.checked;

      localStorage.setItem("showWorking", enabled);
      document.documentElement.classList.toggle("show-working", enabled);

      applyShowWorkingSetting(enabled);
    });
  }

});
