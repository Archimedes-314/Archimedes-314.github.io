const { useState, useEffect } = React;

function GlobalFooter() {
  const date = document.querySelector("footer-div").getAttribute("date");

  return (
    <div>
      <div className="footer-up">
        <ul>
          <li>
            <a href="#">Contact</a>
          </li>
          <li>
            <a href="#">GitHub</a>
          </li>
          <li>
            <a href="#">Licence</a>
          </li>
        </ul>
      </div>

      <div className="footer-down">
        <p>&copy; 2026 Archimedes-314</p>
        <p>
          Last Updated: <span>{date}</span>
        </p>
      </div>
    </div>
  );
}

const footerContainer = document.querySelector("footer-div");
if (footerContainer) {
  const footerRoot = ReactDOM.createRoot(footerContainer);
  footerRoot.render(<GlobalFooter />);
} else {
  console.error("Could not find <footer-div> in the DOM.");
}

function GlobalHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [keys, setKeys] = useState({ sectionKey: "", webpageKey: "" });

  useEffect(() => {
    const pdfContainer = document.getElementById("pdfContainer");
    if (pdfContainer) {
      setKeys({
        sectionKey: pdfContainer.dataset.section || "",
        webpageKey: pdfContainer.dataset.webpage || "",
      });
    }
  }, []);

  useEffect(() => {
    fetch("/maths/assets/asta-error-messages/error-list.html")
      .then((response) => response.text())
      .then((html) => {
        const container = document.getElementById("error-container");
        if (container) {
          container.innerHTML = html;

          if (window.matchMedia("(max-width: 670px)").matches) {
            if (typeof showError === "function") showError("screen");
          } else {
            if (typeof hideError === "function") hideError("screen");
          }
        }
      })
      .catch((err) =>
        console.error("Error list failed to load inside React:", err),
      );
  }, []);

  const COMPLETE_PDF = `/maths/assets/pdf/files/${keys.sectionKey}-section.pdf`;
  const FULL_PDF = `/maths/assets/pdf/files/${keys.webpageKey}-webpage.pdf`;
  const SIMPLE_PDF = `/maths/assets/pdf/files/${keys.webpageKey}-simple.pdf`;

  const handleTogglePdfClick = () => {
    const headerDiv = document.querySelector("header-div");

    if (headerDiv && headerDiv.getAttribute("pdf") === "yes") {
      if (isOpen) {
        const pdfContainer = document.getElementById("pdfContainer");
        if (pdfContainer) pdfContainer.setAttribute("hidden", "");
        setIsOpen(false);
      } else {
        if (typeof showError === "function") showError("pdf-choice");
      }
    } else {
      showError("pdf");
    }
  };

  const handleDownloadPdfClick = () => {
    const headerDiv = document.querySelector("header-div");

    if (headerDiv && headerDiv.getAttribute("pdf") === "yes") {
      if (typeof showError === "function") {
        showError("pdf-download");
      }
    } else {
      showError("pdf");
    }
  };

  const handlePqClick = () => {
    const headerDiv = document.querySelector("header-div");
    const link = headerDiv.getAttribute("pq");

    if (headerDiv && link === "linkError") {
      showError("link");
    } else if (headerDiv && link === "no") {
      showError("pq");
    } else {
      if (typeof showError === "function") {
        redirectLink(link);
      }
    }
  };

  const updatePdfEmbed = (src) => {
    const pdfEmbed = document.getElementById("pdfEmbed");
    const pdfContainer = document.getElementById("pdfContainer");

    if (pdfEmbed && pdfContainer) {
      pdfEmbed.src = src;
      pdfContainer.removeAttribute("hidden");
      setIsOpen(true);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const nextState = !prev;

      if (!nextState) {
        setOpenSubmenus({});
      }
      return nextState;
    });
  };

  const toggleSubmenu = (section) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    window.showCompletePDF = () => {
      if (typeof hideError === "function") hideError("pdf-choice");
      if (!keys.sectionKey)
        return typeof showError === "function" && showError("link");
      updatePdfEmbed(COMPLETE_PDF);
    };

    window.showFullPDF = () => {
      if (typeof hideError === "function") hideError("pdf-choice");
      if (!keys.webpageKey)
        return typeof showError === "function" && showError("link");
      updatePdfEmbed(FULL_PDF);
    };

    window.showSimplePDF = () => {
      if (typeof hideError === "function") hideError("pdf-choice");
      if (!keys.webpageKey)
        return typeof showError === "function" && showError("link");
      updatePdfEmbed(SIMPLE_PDF);
    };

    window.downloadCompletePDF = () => {
      if (typeof hideError === "function") hideError("pdf-download");
      triggerDownload(COMPLETE_PDF, `${keys.sectionKey}-section.pdf`);
    };

    return () => {
      delete window.showCompletePDF;
      delete window.showFullPDF;
      delete window.showSimplePDF;
      delete window.downloadCompletePDF;
    };
  }, [keys, COMPLETE_PDF, FULL_PDF, SIMPLE_PDF]);

  function triggerDownload(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <h1 className="header-h1">Basic Maths Notes</h1>
        <div className="header-actions">
          <input type="checkbox" id="sidebar-active" />
          <label
            htmlFor="sidebar-active"
            className="open-sidebar-btn header-btn"
          >
            Actions
          </label>

          <label htmlFor="sidebar-active" id="sidebar-overlay"></label>
          <div className="actions-container">
            <label
              htmlFor="sidebar-active"
              className="close-sidebar-btn header-btn"
            >
              Close Actions
            </label>

            <label
              htmlFor="sidebar-active"
              className="close-sidebar-btn header-btn"
              onClick={() => typeof toggleMenu === "function" && toggleMenu()}
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
              Navigation Menu
            </label>

            <label
              htmlFor="sidebar-active"
              className="header-btn"
              id="togglePdfBtn"
              aria-expanded={isOpen ? "true" : "false"}
              onClick={handleTogglePdfClick}
            >
              <svg
                className="header-btn-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d={isOpen ? "M5 12h14" : "M12 5v14M5 12h14"}></path>
              </svg>
              <span className="header-btn-text">
                {isOpen ? "Hide PDF" : "Show PDF"}
              </span>
            </label>

            <label
              htmlFor="sidebar-active"
              className="header-btn"
              id="downloadPdfBtn"
              onClick={handleDownloadPdfClick}
            >
              <svg
                className="w-[24px] h-[24px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="header-btn-text">Download PDF</span>
            </label>

            <label
              htmlFor="sidebar-active"
              className="header-btn header-btn-pq"
              onClick={handlePqClick}
            >
              <svg
                className="w-[24px] h-[24px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4"
                />
              </svg>
              <span className="header-btn-text">Practice Questions</span>
            </label>

            <label
              htmlFor="sidebar-active"
              className="header-btn burger"
              onClick={() => typeof toggleMenu === "function" && toggleMenu()}
            >
              <div className={`hamburger ${isMenuOpen ? "open" : ""}`}>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <nav className={`menu ${isMenuOpen ? "open" : ""}`}>
        <div className="burger-link-btn">
          <a href="/index.html">Main Page</a>
        </div>

        <div className="burger-link-btn">
          <a href="/maths/maths-index.html">Home</a>
        </div>

        {/* Formal Logic Section */}
        {/* <div className="burger-link-btn">
          <a href="/maths/formal-logic-i.html">Formal Logic I</a>
          <span 
            className={`arrow ${openSubmenus['formallogic'] ? 'open' : ''}`} 
            onClick={() => toggleSubmenu('formallogic')}
          >➔</span>
        </div>
        <div className={`submenu ${openSubmenus['formallogic'] ? 'open' : ''}`}>
          <a href="/maths/formal-logic-i/syntax-and-semantics/syntax-and-semantics.html">
            Propositional Logic: Syntax and Semantics
          </a>
        </div> 
        */}

        {/* Real Numbers Section */}
        <div className="burger-link-btn">
          <a
            onClick={() => typeof showError === "function" && showError("link")}
          >
            The Real Numbers
          </a>
          <span
            className={`arrow ${openSubmenus["realnums"] ? "open" : ""}`}
            onClick={() => toggleSubmenu("realnums")}
          >
            ➔
          </span>
        </div>
        <div className={`submenu ${openSubmenus["realnums"] ? "open" : ""}`}>
          <a
            onClick={() => typeof showError === "function" && showError("link")}
          >
            Peano Axioms
          </a>
        </div>

        {/* Calculus Section */}
        <div className="burger-link-btn">
          <a
            onClick={() => typeof showError === "function" && showError("link")}
          >
            Calculus I
          </a>
          <span
            className={`arrow ${openSubmenus["calc1"] ? "open" : ""}`}
            onClick={() => toggleSubmenu("calc1")}
          >
            ➔
          </span>
        </div>
        <div className={`submenu ${openSubmenus["calc1"] ? "open" : ""}`}>
          <a
            onClick={() => typeof showError === "function" && showError("link")}
          >
            Temp
          </a>
        </div>

        <div className="burger-link-btn">
          <a href="/maths/settings.html">Settings</a>
        </div>

        <div className="burger-link-btn">
          <a href="/contact.html">Contact</a>
        </div>
      </nav>

      <div
        className={`overlay ${isMenuOpen ? "show" : ""}`}
        onClick={() => typeof toggleMenu === "function" && toggleMenu()}
      ></div>
      <div id="menu-container"></div>
      <div id="error-container"></div>
    </header>
  );
}

const targetContainer = document.querySelector("header-div");
if (targetContainer) {
  // Uses global window object ReactDOM
  const root = ReactDOM.createRoot(targetContainer);
  root.render(<GlobalHeader />);
} else {
  console.error("Could not find <header-div> in the DOM.");
}
