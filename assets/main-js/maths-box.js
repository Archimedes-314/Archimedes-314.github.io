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

function numberMathBoxes() {
  const counters = {
    theorem: 0,
    definition: 0,
    example: 0
  };

  document.querySelectorAll(".math-box").forEach(box => {
    const label = box.querySelector(".math-box-label");
    if (!label) return;

    let type = null;

    if (box.classList.contains("theorem-box")) type = "theorem";
    if (box.classList.contains("definition-box")) type = "definition";
    if (box.classList.contains("example-box")) type = "example";
    if (!type) return;

    counters[type]++;
    const number = counters[type];

    const capitalised = type[0].toUpperCase() + type.slice(1);
    label.textContent = `${capitalised} ${number}`;

    box.dataset.boxType = capitalised;
    box.dataset.boxNumber = number;
  });
}





function wrapInBox(element, title, cls) {
  const isCollapsible = element.dataset.collapsible === "true";
  const boxName = element.dataset.boxName;

  const box = document.createElement("div");
  box.classList.add("math-box", `${cls}-box`);
  if (element.id) box.id = element.id;

  const heading = document.createElement("div");
  heading.classList.add("math-box-title");

  const titleSpan = document.createElement("span");
  titleSpan.classList.add("math-box-title-text");

  const labelSpan = document.createElement("span");
  labelSpan.classList.add("math-box-label");
  labelSpan.textContent = title;

  titleSpan.appendChild(labelSpan);

  if (boxName) {
    const nameSpan = document.createElement("span");
    nameSpan.classList.add("math-box-name");
    nameSpan.textContent = `: ${boxName}`;
    titleSpan.appendChild(nameSpan);
  }

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

      const showWorkingByDefault =
        document.documentElement.classList.contains("show-working");

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


function resolveMathRefs() {
  document.querySelectorAll(".math-ref").forEach(ref => {
    const targetId = ref.dataset.ref;
    const prefix = ref.dataset.prefix ? ref.dataset.prefix + " " : "";

    if (!targetId) return;

    const target = document.getElementById(targetId);

    if (!target || !target.classList.contains("math-box")) {
      ref.textContent = "[broken reference]";
      ref.classList.add("broken-math-ref");

      ref.addEventListener("click", e => {
        e.preventDefault();
        showError("broken-ref");
      });

      return;
    }

    const type = target.dataset.boxType;
    const number = target.dataset.boxNumber;

    if (!type || !number) {
      ref.textContent = "[unresolved reference]";
      ref.classList.add("broken-math-ref");

      ref.addEventListener("click", e => {
        e.preventDefault();
        showError("link");
      });

      return;
    }

    const link = document.createElement("a");
    link.href = `#${targetId}`;
    link.textContent = `${prefix}${type} ${number}`;
    link.classList.add("math-ref-link");

    ref.replaceWith(link);
  });
}







// See <span class="math-ref" data-ref="ex-truth-values"></span>