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
            lorarrow: "\\longrightarrow",
            rarrow: "\\rightarrow",
            ioi: "\\longleftrightarrow",
            sioi: "\\leftrigharrow"
        }
    }
};

function applyShowWorkingSetting(show) {
  document.querySelectorAll(".collapsible-content").forEach(working => {
    const icon = working
      .closest(".math-box")
      ?.querySelector(".toggle-icon");

    if (!icon) return;

    if (show) {
      working.classList.add("open");
      icon.classList.add("open");
      working.style.maxHeight = working.scrollHeight + "px";
    } else {
      working.classList.remove("open");
      icon.classList.remove("open");
      working.style.maxHeight = "0px";
    }
  });
}


window.addEventListener("DOMContentLoaded", () => {
  styleMathBoxes();
  numberMathBoxes();
  resolveMathRefs();
});

const showWorkingByDefault =
  document.documentElement.classList.contains("show-working");

applyShowWorkingSetting(showWorkingByDefault);

function mathsBoxNames(element) {
  const boxName = element?.dataset?.boxName;

  const makeTitle = (label) =>
    boxName ? `${label}: ${boxName}` : label;

  return {
    theorem: makeTitle("Theorem"),
    definition: makeTitle("Definition"),
    example: makeTitle("Example")
  };
}


function styleMathBoxes() {
  const types = [
    { cls: "theorem", title: "theorem" },
    { cls: "definition", title: "definition" },
    { cls: "example", title: "example" }
  ];

  types.forEach(type => {
    document.querySelectorAll(`.${type.cls}`).forEach(el => {
      const names = mathsBoxNames(el);
      const title = names[type.title];
      wrapInBox(el, title, type.cls);
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

      box.appendChild(heading);
      box.appendChild(body);
      element.replaceWith(box);

      const showWorkingByDefault = document.documentElement.classList.contains("show-working");

      if (showWorkingByDefault) {
        working.classList.add("open");
        icon.classList.add("open");

        requestAnimationFrame(() => {
          working.style.maxHeight = working.scrollHeight + "px";
        });
      } else {
        working.style.maxHeight = "0px";
      }

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

      return;
    }
  }

  box.appendChild(heading);
  box.appendChild(body);
  element.replaceWith(box);
}


window.addEventListener("DOMContentLoaded", () => {
  setupCollapsibleSections(
    document.documentElement.classList.contains("show-sections")
  );
});



function setupCollapsibleSections(showByDefault = false) {
  document.querySelectorAll(".collapsible-section").forEach(section => {
    const content = section.querySelector(".section-content");
    const toggle = section.querySelector(".collapse-toggle");

    toggle.innerHTML = "▼"

    if (!content || !toggle) return;

    const open = showByDefault;
    section.classList.toggle("open", open);

    if (open) {
      content.style.maxHeight = content.scrollHeight + "px";
      section.style.setProperty(
        "--content-height",
        content.scrollHeight + "px"
      );
    }

    toggle.addEventListener("click", () => {
      const isOpen = section.classList.toggle("open");

      if (isOpen) {
        content.style.maxHeight = content.scrollHeight + "px";
        section.style.setProperty(
          "--content-height",
          content.scrollHeight + "px"
        );
      } else {
        content.style.maxHeight = "0px";
      }
    });
  });
}
