const Dashboard = ({ onStartQuiz }) => (
  <div className="theme-dashboard">
    <div className="app-container">
      <header className="app-header">
        <div className="user-profile">
          <span className="avatar" title="Enrolled Nurse / Student Nurse">
            EN
          </span>
          <div>
            <h1
              onClick={() => redirectLink("/nursing/index.html")}
              style={{ cursor: "pointer" }}
            >
              Nursing Quiz Portal
            </h1>
            <p>📋 Clinical Competency & Study App</p>
          </div>
        </div>
        <button id="installBtn" className="install-pill">
          Install App
        </button>
      </header>

      {/* Disclaimer Box */}
      <div className="disclaimer-box">
        <strong>
          <span>⚠️</span> Student Notice & Clinical Disclaimer
        </strong>
        <p>
          I am a nursing student and these quizzes are created for my personal
          study use. While I strive for accuracy, I cannot guarantee that all
          answers reflect real-time updates. Please cross-reference with
          official institutional clinical guidelines before practice. Spot an
          error? Feedback is appreciated!
        </p>
      </div>

      <main className="quiz-grid">
        {/* Card 1 */}
        <button
          onClick={() => onStartQuiz("foundations-A-and-P")}
          className="quiz-card"
          type="button"
          aria-label="Start Quiz: Overview of Anatomy and Physiology"
          style={{ "--card-index": 1 }}
        >
          <div className="card-icon" aria-hidden="true">
            🧍
          </div>
          <div className="card-content">
            <h3>Overview of Anatomy & Physiology</h3>
            <p className="card-description">
              Compare and contrast human anatomy and physiological processes,
              and discuss their fundamental relationship.
            </p>
            <span className="badge">Core Anatomy</span>
          </div>
          <div className="arrow" aria-hidden="true">
            →
          </div>
        </button>

        {/* Card 2 */}
        <button
          onClick={() => onStartQuiz("organisation-quiz")}
          className="quiz-card"
          type="button"
          aria-label="Start Quiz: Structural Organisation of the Human Body"
          style={{ "--card-index": 2 }}
        >
          <div className="card-icon" aria-hidden="true">
            🧱
          </div>
          <div className="card-content">
            <h3>Structural Organisation of the Body</h3>
            <p className="card-description">
              Describe the six levels of biological organisation and major
              functions of the eleven organ systems.
            </p>
            <span className="badge">Systemic Nursing</span>
          </div>
          <div className="arrow" aria-hidden="true">
            →
          </div>
        </button>

        {/* Card 3 */}
        {/* <button
          onClick={() => onStartQuiz("organisation-quiz")}
          className="quiz-card"
          type="button"
          aria-label="Start Quiz: Structural Organisation of the Human Body"
          style={{ "--card-index": 2 }}
        >
          <div className="card-icon" aria-hidden="true">
            ⚡
          </div>
          <div className="card-content">
            <h3>Structural Organisation of the Body</h3>
            <p className="card-description">
              Describe the six levels of biological organisation and major
              functions of the eleven organ systems.
            </p>
            <span className="badge">Systemic Nursing</span>
          </div>
          <div className="arrow" aria-hidden="true">
            →
          </div>
        </button> */}

        {/* Card 4 */}
        {/* <button
          onClick={() => onStartQuiz("organisation-quiz")}
          className="quiz-card"
          type="button"
          aria-label="Start Quiz: Structural Organisation of the Human Body"
          style={{ "--card-index": 2 }}
        >
          <div className="card-icon" aria-hidden="true">
            🌡️
          </div>
          <div className="card-content">
            <h3>Structural Organisation of the Body</h3>
            <p className="card-description">
              Describe the six levels of biological organisation and major
              functions of the eleven organ systems.
            </p>
            <span className="badge">Systemic Nursing</span>
          </div>
          <div className="arrow" aria-hidden="true">
            →
          </div>
        </button> */}

        {/* Card 5 */}
        {/* <button
          onClick={() => onStartQuiz("organisation-quiz")}
          className="quiz-card"
          type="button"
          aria-label="Start Quiz: Structural Organisation of the Human Body"
          style={{ "--card-index": 2 }}
        >
          <div className="card-icon" aria-hidden="true">
            ⚖️
          </div>
          <div className="card-content">
            <h3>Structural Organisation of the Body</h3>
            <p className="card-description">
              Describe the six levels of biological organisation and major
              functions of the eleven organ systems.
            </p>
            <span className="badge">Systemic Nursing</span>
          </div>
          <div className="arrow" aria-hidden="true">
            →
          </div>
        </button> */}

        {/* Card 6 - Systemic Organization */}
        {/* <button
          onClick={() => onStartQuiz("organisation-quiz")}
          className="quiz-card"
          type="button"
          aria-label="Start Quiz: Structural Organisation of the Human Body"
          style={{ "--card-index": 2 }}
        >
          <div className="card-icon" aria-hidden="true">
            🧭
          </div>
          <div className="card-content">
            <h3>Structural Organisation of the Body</h3>
            <p className="card-description">
              Describe the six levels of biological organisation and major
              functions of the eleven organ systems.
            </p>
            <span className="badge">Systemic Nursing</span>
          </div>
          <div className="arrow" aria-hidden="true">
            →
          </div>
        </button> */}

        {/* Card 7 - Systemic Organization */}
        {/* <button
          onClick={() => onStartQuiz("organisation-quiz")}
          className="quiz-card"
          type="button"
          aria-label="Start Quiz: Structural Organisation of the Human Body"
          style={{ "--card-index": 2 }}
        >
          <div className="card-icon" aria-hidden="true">
            🦴
          </div>
          <div className="card-content">
            <h3>Structural Organisation of the Body</h3>
            <p className="card-description">
              Describe the six levels of biological organisation and major
              functions of the eleven organ systems.
            </p>
            <span className="badge">Systemic Nursing</span>
          </div>
          <div className="arrow" aria-hidden="true">
            →
          </div>
        </button> */}
      </main>
    </div>
  </div>
);
