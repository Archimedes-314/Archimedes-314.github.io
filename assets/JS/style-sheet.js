document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.break').forEach(el => {
        el.style.height = `${el.dataset.brLength}`
    });

    document.querySelectorAll('.multicol').forEach(el => {
        const number = el.dataset.colNumber;
        const gap = el.dataset.colGap;

        el.style.columnCount = `${number}`;
        el.style.columnGap = `${gap}`
    });
});

class BreakElement extends HTMLElement {
  connectedCallback() {
    const size = this.getAttribute("size") || "1rem";
    this.style.display = "block";
    this.style.height = size;
  }
}

customElements.define("gap-", BreakElement);

const redirectLink = e => {window.location.href = `${e}`}