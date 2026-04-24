const Dashboard = ({ onStartQuiz }) => (
  <div className="app-container">
    <header className="app-header">
      <div className="user-profile">
        <span className="avatar">EN</span>
        <div>
          <h1>Nursing Quiz Portal</h1>
          <p>My Collection of Clinical Competency Quizzes</p>
        </div>
      </div>
      <button id="installBtn" className="install-pill">
        Install App
      </button>
    </header>

    <div className="disclaimer-box">
      <strong>Student Notice & Disclaimer</strong>
      <p>
        I am a nursing student and these quizzes are created for my personal
        study use. While I strive for accuracy, I cannot guarantee that all
        answers are correct. Please cross-reference with official clinical
        guidelines. If you spot an error, I would greatly appreciate your
        feedback!
      </p>
    </div>

    <section className="stats-bar">
      <div className="stat-item">
        <span className="stat-value">3</span>
        <span className="stat-label">Modules</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">100%</span>
        <span className="stat-label">Progress</span>
      </div>
    </section>

    <main className="quiz-grid">
      <div
        onClick={() => onStartQuiz("testing")}
        className="quiz-card"
        style={{ cursor: "pointer" }}
      >
        <div className="card-icon">
          <img src="/maths/assets/style/images/archimedes_cur.png" alt="icon" />
        </div>
        <div className="card-content">
          <h3>Testing Quiz</h3>
          <p>My Testing Quiz</p>
          <span className="badge blue">Test</span>
        </div>
        <div className="arrow">→</div>
      </div>

      <div onClick={() => alert("Not Yet Complete")} className="quiz-card">
        <div className="card-icon">🧪</div>
        <div className="card-content">
          <h3>Drug Calculations</h3>
          <p>Calculations & Geography</p>
          <span className="badge">Medication</span>
        </div>
        <div className="arrow">→</div>
      </div>

      <div onClick={() => alert("Not Yet Complete")} className="quiz-card">
        <div className="card-icon">💊</div>
        <div className="card-content">
          <h3>Pharmacology</h3>
          <p>Dosage & Administration</p>
          <span className="badge">Medication</span>
        </div>
        <div className="arrow">→</div>
      </div>
    </main>
  </div>
);
