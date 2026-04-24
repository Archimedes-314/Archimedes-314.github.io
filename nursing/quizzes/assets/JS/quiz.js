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
          Submit
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
