window.MathJax = {
    tex: {
        macros: {
            // Basic sets
            R: "\\mathbb{R}",
            Q: "\\mathbb{Q}",
            Z: "\\mathbb{Z}",
            N: "\\mathbb{N}",
            C: "\\mathbb{C}",


            // Operators
            abs: ["\\left|#1\\right|", 1],
            norm: ["\\left\\lVert#1\\right\\rVert", 1],
            inner: ["\\langle #1, #2 \\rangle", 2],


// Logic & limits
limn: "\\lim_{n \\to \\infty}",
limx: ["\\lim_{x \\to #1}", 1],


// Sequences & functions
seq: ["\\{ #1 \\}_{n=1}^\\infty", 1],
fn: ["#1 : #2 \\to #3", 3],


// Intervals
open: ["( #1, #2 )", 2],
closed: ["[ #1, #2 ]", 2],
halfopen: ["[ #1, #2 )", 2],


// Misc
eps: "\\varepsilon",
empty: "\\varnothing"
}
}
};

window.addEventListener("DOMContentLoaded", () => {
  styleMathBoxes();
});

function styleMathBoxes() {
  const types = [
    { cls: "theorem", title: "Theorem" },
    { cls: "definition", title: "Definition" },
    { cls: "example", title: "Example" }
  ];

  types.forEach(type => {
    const elements = document.querySelectorAll(`.${type.cls}`);
    elements.forEach(el => wrapInBox(el, type.title, type.cls));
  });
}

function wrapInBox(element, title, cls) {
  const box = document.createElement("div");
  box.classList.add("math-box", cls + "-box");

  const heading = document.createElement("div");
  heading.classList.add("math-box-title");
  heading.textContent = title;

  const body = document.createElement("div");
  body.classList.add("math-box-body");
  body.innerHTML = element.innerHTML;

  box.appendChild(heading);
  box.appendChild(body);

  element.replaceWith(box);
}
