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
          activeLink.classList.add("active");
        }
      });
    },
    {
      root: null,
      rootMargin: "-40% 0px -60% 0px",
      threshold: 0
    }
  );

  sections.forEach(section => observer.observe(section));
});
