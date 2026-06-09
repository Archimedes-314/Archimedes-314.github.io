const { useState, useEffect } = React;

const categorisationQuestion = ["Anatomy", "Physiology"];

const foundationsAnPData = [
  {
    type: "multiple-select",
    question:
      "Measuring the electrical activity of the heart using an electrocardiogram (ECG)",
    options: categorisationQuestion,
    answers: ["Physiology"],
  },
  {
    type: "multiple-select",
    question:
      "Identifying the lobes, fissures, and sulci of the human brain during a dissection lab.",
    options: categorisationQuestion,
    answers: ["Anatomy"],
  },
  {
    type: "multiple-select",
    question:
      "Using an electron microscope to examine the structural layers of a cell membrane.",
    options: categorisationQuestion,
    answers: ["Anatomy"],
  },
  {
    type: "multiple-select",
    question:
      "Investigating how the rate of oxygen diffusion across alveolar walls changes during exercise.",
    options: categorisationQuestion,
    answers: ["Physiology"],
  },
  {
    type: "multiple-select",
    question:
      "Performing a biopsy to check for abnormal cell arrangements in epithelial tissue.",
    options: categorisationQuestion,
    answers: ["Anatomy"],
  },
  {
    type: "multiple-select",
    question:
      "Testing how varying levels of hormone binding affect glucose uptake in skeletal muscle cells.",
    options: categorisationQuestion,
    answers: ["Physiology"],
  },
  {
    type: "long-response",
    question: "What does the scientific study of anatomy encompass?",
    answers: [
      "Anatomy is the scientific study of the body's structures, their locations, and their physical relationships to one another. It provides the biological map of our cells, tissues, organs and organ systems.",
    ],
  },
  {
    type: "long-response",
    question: "What does the scientific study of physiology encompass?",
    answers: [
      "The scientific study of the chemistry and physics of the structures of the body and the ways in which they work together to support the functions of life.",
    ],
  },
  {
    type: "long-response",
    question: "What is homeostasis?",
    answers: [
      "The state of steady internal conditions maintained by living things; the dynamic equilibrium that the physiological mechanisms of the body constantly work to preserve.",
    ],
  },
  {
    type: "long-response",
    question: "What are the two main types of human anatomy?",
    answers: [
      "Some structures studied in anatomy can only been seen through a microscope (e.g., cells). The study of these structures is called microscopic anatomy. Other structures can be seen without a microscope (e.g., heart and lungs). The study of these structures is called macroscopic (or gross) anatomy.",
    ],
  },
  {
    type: "long-response",
    question:
      "What are the two general approaches to the study of human anatomy?",
    answers: [
      "The two general approaches include regional anatomy and systemic anatomy. Regional anatomy is the study of the interrelationships of all the structures in a specific body region, such as the abdomen. In contrast, systemic anatomy is the study of the structures that make up a discrete body system—that is, a group of structures that work together to perform a unique body function. For example, a systemic anatomy study of the muscular system would consider all of the skeletal muscles of the body.",
    ],
  },
];

const BreathingBasic = ({ quizType, onBack }) => {
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleRandomise = () => {
    const selectedData =
      quizType === "breathing-written"
        ? breathingWrittenData
        : quizType === "circulation-basic"
          ? circulationBasicData
          : foundationsAnPData;

    const dataWithIds = selectedData.map((q, index) => ({
      ...q,
      id: `q-${index}`,
    }));
    setShuffledQuestions(shuffleArray(dataWithIds));
    setUserAnswers({});
    setSubmitted(false);
  };

  useEffect(() => {
    handleRandomise();
  }, [quizType]);

  const updateAnswer = (qid, value) => {
    setUserAnswers((prev) => ({ ...prev, [qid]: value }));
    setSubmitted(false);
  };

  const checkCorrectness = (item) => {
    const input = userAnswers[item.id];
    if (!input) return false;

    if (item.type === "written") {
      const cleanInput = (typeof input === "string" ? input : "")
        .trim()
        .toLowerCase();
      return item.answers.some((a) => a.trim().toLowerCase() === cleanInput);
    }

    if (item.type === "long-response") {
      return null;
    }

    if (item.type === "written-cs") {
      const cleanInput = (typeof input === "string" ? input : "").trim();
      return item.answers.some((a) => a.trim() === cleanInput);
    }

    if (item.type === "multiple-select") {
      if (!Array.isArray(input)) return false;
      return (
        item.answers.length === input.length &&
        item.answers.every((a) => input.includes(a))
      );
    }

    if (item.type === "written-unordered") {
      const cleanInputs = Object.values(input)
        .map((v) => v.trim().toLowerCase())
        .filter((v) => v !== "");

      const cleanAnswers = item.answers.map((a) => a.trim().toLowerCase());

      return (
        cleanAnswers.length === cleanInputs.length &&
        cleanAnswers.every((a) => cleanInputs.includes(a))
      );
    }

    if (item.type === "written-unordered-cs") {
      const cleanInputs = Object.values(input)
        .map((v) => v.trim())
        .filter((v) => v !== "");

      const cleanAnswers = item.answers.map((a) => a.trim());

      return (
        cleanAnswers.length === cleanInputs.length &&
        cleanAnswers.every((a) => cleanInputs.includes(a))
      );
    }

    if (item.type === "written-ordered") {
      const cleanInputs = Object.values(input)
        .map((v) => v.trim().toLowerCase())
        .filter((v) => v !== "");

      const cleanAnswers = item.answers.map((a) => a.trim().toLowerCase());

      if (cleanInputs.length !== cleanAnswers.length) return false;

      return cleanAnswers.every((ans, index) => {
        const userVal = (input[index] || "").trim().toLowerCase();
        return userVal === ans;
      });
    }

    if (item.type === "written-ordered-cs") {
      const cleanInputs = Object.values(input)
        .map((v) => v.trim())
        .filter((v) => v !== "");

      const cleanAnswers = item.answers.map((a) => a.trim());

      if (cleanInputs.length !== cleanAnswers.length) return false;

      return cleanAnswers.every((ans, index) => {
        const userVal = (input[index] || "").trim();
        return userVal === ans;
      });
    }

    return false;
  };

  return (
    <div className="main-div">
      <button onClick={onBack} style={{ marginBottom: "20px" }}>
        ← Back
      </button>
      <h1>Nursing Quiz</h1>

      {shuffledQuestions.map((item) => {
        const isCorrect = checkCorrectness(item);

        return (
          <div
            key={item.id}
            className="question-div"
            style={{ marginBottom: "30px" }}
          >
            <h2>{item.question}</h2>

            {/* TYPE: STANDARD WRITTEN */}
            {item.type === "written" && (
              <textarea
                type="text"
                placeholder="Type your answer here..."
                value={userAnswers[item.id] || ""}
                onChange={(e) => updateAnswer(item.id, e.target.value)}
                style={{ width: "100%", padding: "10px" }}
              />
            )}

            {/* TYPE: Long Response */}
            {item.type === "long-response" && (
              <textarea
                placeholder="Type your answer here..."
                value={userAnswers[item.id] || ""}
                onChange={(e) => updateAnswer(item.id, e.target.value)}
                rows={4}
                style={{ width: "100%", padding: "10px", resize: "vertical" }}
              />
            )}

            {/* TYPE: MULTIPLE SELECT (Checkboxes) */}
            {item.type === "multiple-select" && (
              <div className="options-grid">
                {item.options.map((opt) => (
                  <label
                    key={opt}
                    style={{ display: "block", margin: "5px 0" }}
                  >
                    <input
                      type="checkbox"
                      checked={(userAnswers[item.id] || []).includes(opt)}
                      onChange={(e) => {
                        const current = userAnswers[item.id] || [];
                        const next = e.target.checked
                          ? [...current, opt]
                          : current.filter((o) => o !== opt);
                        updateAnswer(item.id, next);
                      }}
                    />{" "}
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {/* TYPE: MULTI-WRITTEN (Ordered or Unordered) */}
            {(item.type === "written-unordered" ||
              item.type === "written-ordered") && (
              <div className="input-group">
                {Array.from({
                  length: item.answers.length + (item.extraBoxes || 0),
                }).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Answer ${i + 1}`}
                    value={
                      (userAnswers[item.id] && userAnswers[item.id][i]) || ""
                    }
                    onChange={(e) => {
                      const current = userAnswers[item.id] || {};
                      updateAnswer(item.id, {
                        ...current,
                        [i]: e.target.value,
                      });
                    }}
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      width: "100%",
                      padding: "8px",
                    }}
                  />
                ))}
                {item.type === "written-ordered" && (
                  <small style={{ color: "#666" }}>*Order matters</small>
                )}
              </div>
            )}

            {/* FEEDBACK SECTION WITH COLORS */}
            {submitted && (
              <div
                className={`feedback ${isCorrect ? "correct" : "incorrect"}`}
                style={{
                  marginTop: "10px",
                  padding: "15px",
                  borderRadius: "8px",
                  border: `1px solid ${isCorrect === null ? "#bee3f8" : isCorrect ? "#c6f6d5" : "#fed7d7"}`,
                  backgroundColor:
                    isCorrect === null
                      ? "#f0f9ff"
                      : isCorrect
                        ? "#f0fff4"
                        : "#fff5f5",
                  color:
                    isCorrect === null
                      ? "#0369a1"
                      : isCorrect
                        ? "#2f855a"
                        : "#c53030",
                }}
              >
                <strong>
                  {isCorrect === null
                    ? "ⓘ Answer"
                    : isCorrect
                      ? "✓ CORRECT"
                      : "✕ INCORRECT"}
                </strong>
                {!isCorrect && (
                  <p style={{ margin: "5px 0 0" }}>
                    Expected: {item.answers.join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      <button
        className="btn-submit"
        onClick={() => setSubmitted(true)}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Submit Quiz
      </button>
      <button
        className="btn-reset"
        onClick={handleRandomise}
        style={{ marginLeft: "10px" }}
      >
        Reset & Randomise
      </button>
    </div>
  );
};
