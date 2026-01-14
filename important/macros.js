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
  numberMathBoxes();
  resolveMathRefs();
});


function styleMathBoxes() {
  const types = [
    { cls: "theorem", title: "Theorem" },
    { cls: "definition", title: "Definition" },
    { cls: "example", title: "Example" }
  ];

  types.forEach(type => {
    document.querySelectorAll(`.${type.cls}`).forEach(el => {
      wrapInBox(el, type.title, type.cls);
    });
  });
}

function wrapInBox(element, title, cls) {
  const isCollapsible = element.dataset.collapsible === "true";

  const box = document.createElement("div");
  box.classList.add("math-box", `${cls}-box`);

  if (element.id) box.id = element.id;


  const heading = document.createElement("div");
  heading.classList.add("math-box-title");

  const titleSpan = document.createElement("span");
  titleSpan.classList.add("math-box-title-text");
  titleSpan.textContent = title;

  heading.appendChild(titleSpan);


  const body = document.createElement("div");
  body.classList.add("math-box-body");
  body.innerHTML = element.innerHTML;


  if (isCollapsible) {
    const working = body.querySelector(".working");

    if (working) {
      working.classList.add("collapsible-content");

      const icon = document.createElement("button");
      icon.classList.add("toggle-icon");
      icon.innerHTML = "▼";

      heading.appendChild(icon);

      icon.addEventListener("click", () => {
        const open = working.classList.toggle("open");

        if (open) {
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

function numberMathBoxes() {
  const counters = {
    theorem: 0,
    definition: 0,
    example: 0
  };

  document.querySelectorAll(".math-box").forEach(box => {
    let type;

    if (box.classList.contains("theorem-box")) type = "theorem";
    if (box.classList.contains("definition-box")) type = "definition";
    if (box.classList.contains("example-box")) type = "example";

    if (!type) return;

    const number = ++counters[type];
    box.dataset.type = type;
    box.dataset.number = number;

    const titleSpan = box.querySelector(".math-box-title-text");
    const label = type.charAt(0).toUpperCase() + type.slice(1);

    titleSpan.textContent = `${label} ${number}`;
  });
}

function resolveMathRefs() {
  document.querySelectorAll("a.math-ref").forEach(ref => {
    const targetId = ref.getAttribute("href")?.substring(1);
    if (!targetId) return;

    const box = document.getElementById(targetId);
    if (!box) return;

    const type = box.dataset.type;
    const number = box.dataset.number;
    if (!type || !number) return;

    const label = type.charAt(0).toUpperCase() + type.slice(1);
    ref.textContent = `${label} ${number}`;
  });
}



