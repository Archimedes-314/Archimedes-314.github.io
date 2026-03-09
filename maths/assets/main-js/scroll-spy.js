document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("main section");
  const navLinks = document.querySelectorAll(".sub-links a[href^='#']");

  const linkMap = new Map();
  navLinks.forEach(link => {
    const id = link.getAttribute("href").substring(1);
    linkMap.set(id, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.remove("active"));

          const activeLink = linkMap.get(entry.target.id);
          if (activeLink) {
            activeLink.classList.add("active");
          }
        }
      });
    },
    {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0
    }
  );

  sections.forEach(section => observer.observe(section));
});
