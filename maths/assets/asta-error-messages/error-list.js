function showError(type) {
    const overlay = document.querySelector(`.${type}-error-container`);
    if (!overlay) return;
    overlay.classList.add(`show-error`);
}

function hideError(type) {
    const overlay = document.querySelector(`.${type}-error-container`);
    if (!overlay) return;
    overlay.classList.remove(`show-error`);
}

const screenQuery = window.matchMedia("(max-width: 670px)");

function handleScreenSize(e) {
    if (e.matches) {
        showError("screen");
    } else {
        hideError("screen");
    }
}

handleScreenSize(screenQuery);
screenQuery.addEventListener("change", handleScreenSize);

