function toggleDetails(id) {
  const detailElement = document.getElementById(id);
  const isActive = detailElement.classList.contains("active");

  document
    .querySelectorAll(".details")
    .forEach((el) => el.classList.remove("active"));

  if (!isActive) {
    detailElement.classList.add("active");
  }
}

{
  const emailContainer = document.querySelector(".email-container");
  const emailDiv = document.querySelector(".email-box");

  emailContainer.addEventListener("click", () => {
    emailDiv.classList.add("show");
  });

  window.addEventListener("click", (e) => {
    if (!emailContainer.contains(e.target) && !emailDiv.contains(e.target)) {
      emailDiv.classList.remove("show");
    }
  });
}

{
  function expandBtn(id) {
    const el = document.getElementById(`${id}-expanded`);
    const btn = event.currentTarget;
    const arrow = btn.querySelector(".expand-btn-arrow");

    if (el.style.height === "0px" || !el.style.height) {
      el.style.height = el.scrollHeight + "px";
      arrow.innerHTML = "▲";
      btn.firstChild.textContent = "Collapse ";
    } else {
      el.style.height = "0px";
      arrow.innerHTML = "▼";
      btn.firstChild.textContent = "Expand ";
    }
  }
}

const summarySizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const height = entry.contentRect.height;
    const width = entry.contentRect.width;

    if (height > 140 || width < 400) {
      entry.target.classList.add("tight-corners");
    } else {
      entry.target.classList.remove("tight-corners");
    }
  }
});

document.querySelectorAll(".entry .summary").forEach((summary) => {
  summarySizeObserver.observe(summary);
});
