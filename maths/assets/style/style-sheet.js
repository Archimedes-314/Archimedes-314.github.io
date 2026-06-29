{
  const body = document.querySelector("body");
  const breakPoint = body.dataset.setSmallAt || "930px";
  const screenQuery = window.matchMedia(`(max-width: ${breakPoint})`);

  function setSmallStyling() {
    if (screenQuery.matches) {
      body.classList.add("set-small");
    } else {
      body.classList.remove("set-small");
      const checkbox = document.getElementById("sidebar-active");
      if (checkbox) checkbox.checked = false;
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

// ============== HEADER ============== //
class HeaderElement extends HTMLElement {
  connectedCallback() {}
}
customElements.define("header-div", HeaderElement);

// ============== FOOTER ============== //
class FooterElement extends HTMLElement {
  connectedCallback() {}
}
customElements.define("footer-div", FooterElement);

// ============== Topic Counter ============== //
{
  const counters = document.querySelectorAll("ul.topic-list li h3");

  counters.forEach((h3, i) => {
    const anchor = h3.querySelector("a");
    const titleSpan = h3.querySelector("a span");

    if (anchor && titleSpan) {
      const titleText = titleSpan.textContent;

      anchor.innerHTML = `${i + 1}. <span>${titleText}</span>`;
    }
  });
}

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
