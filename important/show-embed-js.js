document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("togglePdfBtn");
  const pdfContainer = document.getElementById("pdfContainer");
  const pdfEmbed = document.getElementById("pdfEmbed");
  const iconPath = btn.querySelector("svg path");
  const text = btn.querySelector(".header-btn-text");

  const sectionKey = pdfContainer.dataset.section;
  const webpageKey = pdfContainer.dataset.webpage;

  const COMPLETE_PDF = `/assets/pdf/${sectionKey}-section.pdf`;
  const FULL_PDF = `/assets/pdf/${webpageKey}-webpage.pdf`;
  const SIMPLE_PDF = `/assets/pdf/${webpageKey}-simple.pdf`;

  btn.addEventListener("click", () => {
    const isOpen = !pdfContainer.hasAttribute("hidden");

    if (isOpen) {
      pdfContainer.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
      text.textContent = "Show PDF";
      iconPath.setAttribute("d", "M12 5v14M5 12h14");
      return;
    }

    showError("pdf-choice");
  });

  window.showCompletePDF = function () {
    hideError("pdf-choice");

    pdfEmbed.src = COMPLETE_PDF;

    pdfContainer.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "true");
    text.textContent = "Hide PDF";
    iconPath.setAttribute("d", "M5 12h14");
  };

  window.showFullPDF = function () {
    hideError("pdf-choice");

    pdfEmbed.src = FULL_PDF;

    pdfContainer.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "true");
    text.textContent = "Hide PDF";
    iconPath.setAttribute("d", "M5 12h14");
  };

  window.showSimplePDF = function () {
    hideError("pdf-choice");

    pdfEmbed.src = SIMPLE_PDF;

    pdfContainer.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "true");
    text.textContent = "Hide PDF";
    iconPath.setAttribute("d", "M5 12h14");
  };

  const downloadBtn = document.getElementById("downloadPdfBtn");

  downloadBtn.addEventListener("click", () => {
    showError("pdf-download");
  });

  window.downloadCompletePDF = function () {
    hideError("pdf-download");
    triggerDownload(COMPLETE_PDF, `${sectionKey}-complete.pdf`);
  };

  window.downloadFullPDF = function () {
    hideError("pdf-download");
    triggerDownload(FULL_PDF, `${webpageKey}.pdf`);
  };

  window.downloadSimplePDF = function () {
    hideError("pdf-download");
    triggerDownload(SIMPLE_PDF, `${webpageKey}-simple.pdf`);
  };

  function triggerDownload(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
});
