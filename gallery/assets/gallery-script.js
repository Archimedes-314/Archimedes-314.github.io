function toggleZoom(imgElement) {
  const backdrop = document.getElementById("lightboxBackdrop");
  const isExpanded = imgElement.classList.contains("expanded");

  closeAllImages();

  if (!isExpanded) {
    imgElement.classList.add("expanded");
    backdrop.classList.add("active");
  }
}

function closeAllImages() {
  const backdrop = document.getElementById("lightboxBackdrop");
  const expandedImages = document.querySelectorAll(
    ".photo-container img.expanded",
  );

  expandedImages.forEach((img) => {
    img.classList.remove("expanded");
  });
  backdrop.classList.remove("active");
}
