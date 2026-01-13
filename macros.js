window.MathJax = {
    tex: {
        macros: {
            // Roman, bold, and style shortcuts
            re: "\\mathrm{Re}",
            im: "\\mathrm{Im}",
            diam: "\\mathrm{diam}",
            cis: "\\mathrm{cis}",
            Arg: "\\mathrm{Arg}",
            R: "\\mathbb{R}",
            Q: "\\mathbb{Q}",
            Z: "\\mathbb{Z}",
            N: "\\mathbb{N}",
            C: "\\mathbb{C}",
            Ce: "\\widehat{\\mathbb{C}}",
            i: "\\mathrm{i}",
            d: "\\mathrm{d}",
            S: "{\\mathrm{S}}",
            e: "\\mathrm{e}",
            eps: "\\varepsilon",
            bar: ["{\\overline{#1}}", 1],


            // Operators
            suma: ["\\sum_{#1}^{#2}{#3}", 3],
            sumb: ["\\sum_{#1}{#2}", 2],

            Lim: ["\\lim_{#1 \\to #2}{#3}", 3],
            To: ["\\overset{#1\\to#2}{\\lorarrow}", 2],

            seq: ["\\{ #1 \\}_{#2}^{#3}}", 3],
            fn: ["#1 : #2 \\to #3", 3],

            abs: ["\\left|#1\\right|", 1],
            norm: ["\\left\\lVert#1\\right\\rVert", 1],


            // Symbols 
            lorarrow: "\\longrightarrow"
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
  const isCollapsible = element.dataset.collapsible === "true";

  const box = document.createElement("div");
  box.classList.add("math-box", `${cls}-box`);

  const heading = document.createElement("div");
  heading.classList.add("math-box-title");

  const titleSpan = document.createElement("span");
  titleSpan.textContent = title;

  heading.appendChild(titleSpan);

  const body = document.createElement("div");
  body.classList.add("math-box-body");
  body.innerHTML = element.innerHTML;

  if (isCollapsible) {
    const working = body.querySelector(".working");

    if (working) {
      working.classList.add("collapsible-content");

      // Create the rotating icon
      const icon = document.createElement("button");
      icon.classList.add("toggle-icon");
      icon.innerHTML = "▼";

      heading.appendChild(icon);

      icon.addEventListener("click", () => {
        const isOpen = working.classList.toggle("open");

        if (isOpen) {
          working.style.maxHeight = working.scrollHeight + "px";
          icon.classList.add("open");
        } else {
          working.style.maxHeight = "0px";
          icon.classList.remove("open");
        }
      });
    }
  }

  box.appendChild(heading);
  box.appendChild(body);
  element.replaceWith(box);
}


