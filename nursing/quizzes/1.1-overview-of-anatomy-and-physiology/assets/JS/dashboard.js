const Dashboard = ({ onStartQuiz }) => (
  <div className="app-container">
    <header className="app-header">
      <div className="user-profile">
        <span className="avatar">EN</span>
        <div>
          <h1 onClick={() => redirectLink("/nursing/index.html")}>
            Nursing Quiz Portal
          </h1>
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
        onClick={() => onStartQuiz("foundations-A-and-P")}
        className="quiz-card"
        style={{ cursor: "pointer" }}
      >
        <div className="card-icon">
          <img src="/maths/assets/style/images/archimedes_cur.png" alt="icon" />
        </div>
        <div className="card-content">
          <h3>Basic Breathing Quiz</h3>
          <p>
            A multi-choice quiz based on the breathing step of the ABCDE
            assessment.
          </p>
          <span className="badge blue">ABCDE Assessment</span>
        </div>
        <div className="arrow">→</div>
      </div>
    </main>
  </div>
);
