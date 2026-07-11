document.addEventListener("DOMContentLoaded", () => {
  // Legacy for old HTML as I transition
  document.querySelectorAll(".break").forEach((el) => {
    el.style.height = `${el.dataset.brLength}`;
  });

  document.querySelectorAll(".multicol").forEach((el) => {
    const number = el.dataset.colNumber;
    const gap = el.dataset.colGap;

    el.style.columnCount = `${number}`;
    el.style.columnGap = `${gap}`;
  });
});

{
  const body = document.querySelector("body");
  const breakPoint = body.dataset.setSmallAt || "930px";
  const screenQuery = window.matchMedia(`(max-width: ${breakPoint})`);
  const overlay = document.getElementById("sidebar-overlay");

  function setSmallStyling() {
    if (screenQuery.matches) {
      body.classList.add("set-small");
      overlay.style.display = "block";
    } else {
      body.classList.remove("set-small");
      overlay.style.display = "none";
    }

    console.log("function ran");
  }

  setSmallStyling();
  screenQuery.addEventListener("change", setSmallStyling);
}

// ============== GAP ============== //
class BreakElement extends HTMLElement {
  connectedCallback() {
    const size = this.getAttribute("size") || "1rem";
    this.style.display = "block";
    this.style.height = size;
  }
}
customElements.define("gap-", BreakElement);

// ============== FOOTER ============== //

class FooterElement extends HTMLElement {
  connectedCallback() {}
}
customElements.define("footer-div", FooterElement);

// ============== MILTI COL ============== //
class MultiColumn extends HTMLElement {
  connectedCallback() {
    const minColWidth = this.getAttribute("min-width") || "300px";
    const gap = this.getAttribute("gap") || "2rem";
    const maxCols = this.getAttribute("max-cols");

    this.style.display = "block";
    this.style.columnGap = gap;
    this.style.columnWidth = minColWidth;

    if (maxCols) {
      this.style.columnCount = maxCols;
    }
  }
}
customElements.define("multi-col", MultiColumn);

const redirectLink = (e) => {
  window.location.href = `${e}`;
};
const confirmRedirectLink = (link, message) => {
  if (confirm(message)) {
    redirectLink(link);
  }
};
const linksScroll = (e) => {
  document.getElementById(`${e}`).scrollIntoView({
    behavior: "smooth",
  });
};
