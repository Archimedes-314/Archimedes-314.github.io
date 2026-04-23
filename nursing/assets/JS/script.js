const { useState, useEffect } = React;

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

const Quiz = ({ onBack }) => {
  const quizData = [
    { id: "q1", question: "What is 2+2?", answers: ["4", "four"] },
    { id: "q2", question: "Capital of QLD?", answers: ["Brisbane"] },
    {
      id: "q3",
      question: "Best truck?",
      answers: ["Kenworth T909", "T909"],
    },
  ];

  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem("submitCount");
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  const handleSubmit = () => {
    setSubmitted(true);
    const nextCount = count + 1;
    setCount(nextCount);
    localStorage.setItem("submitCount", nextCount);
  };

  const resetCount = () => {
    localStorage.removeItem("submitCount");
    setCount(0);
    setSubmitted(false);
    setUserAnswers({});
  };

  return (
    <div className="main-div">
      <button
        onClick={onBack}
        style={{ marginBottom: "20px", cursor: "pointer" }}
      >
        ← Back to Dashboard
      </button>
      <h1>Nursing Knowledge Review</h1>

      {quizData.map((item) => {
        const userInput = userAnswers[item.id]?.trim().toLowerCase() || "";
        const isCorrect = item.answers.some(
          (a) => a.trim().toLowerCase() === userInput,
        );

        return (
          <div key={item.id} className="question-div">
            <h2>{item.question}</h2>
            <input
              type="text"
              placeholder="Type your answer here..."
              value={userAnswers[item.id] || ""}
              onChange={(e) => {
                setUserAnswers((prev) => ({
                  ...prev,
                  [item.id]: e.target.value,
                }));
                setSubmitted(false);
              }}
            />
            {submitted && (
              <div
                className="feedback"
                style={{
                  backgroundColor: isCorrect ? "#f0fff4" : "#fff5f5",
                  color: isCorrect ? "#2f855a" : "#c53030",
                  border: `1px solid ${isCorrect ? "#c6f6d5" : "#fed7d7"}`,
                }}
              >
                <strong>{isCorrect ? "✓ CORRECT" : "✕ NOT QUITE"}</strong>
                {!isCorrect && <p>Expected: {item.answers.join(", ")}</p>}
              </div>
            )}
          </div>
        );
      })}

      <div className="btn-container">
        <button className="btn-submit" onClick={handleSubmit}>
          Submit ({count} {count === 1 ? "try" : "tries"})
        </button>
        {count > 0 && (
          <button className="btn-reset" onClick={resetCount}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState("home");

  useEffect(() => {
    const wrapper = document.getElementById("app-wrapper");
    if (view === "home") {
      wrapper.className = "theme-dashboard";
    } else {
      wrapper.className = "theme-quiz";
    }
  }, [view]);

  return (
    <div>
      {view === "home" ? (
        <Dashboard onStartQuiz={() => setView("quiz")} />
      ) : (
        <Quiz onBack={() => setView("home")} />
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
