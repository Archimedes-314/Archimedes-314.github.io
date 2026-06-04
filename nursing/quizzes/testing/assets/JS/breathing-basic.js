const { useState, useEffect } = React;

const patternsOfBreathingData = [
  "Eupnoea",
  "Tachypnoea",
  "Bradypnoea",
  "Cheyne-Stokes",
  "Biot's or ataxic",
  "Kussmaul",
  "Pursed-lip breathing",
  "Hyperventilation",
  "Hypoventilation",
];

const rrData = [
  "30\u201360",
  "30\u201350",
  "25\u201332",
  "20\u201330",
  "16\u201319",
  "12\u201320",
];
const breathingBasicData = [
  {
    type: "multiple-select",
    question:
      "PATTERNS OF BREATHING: Which of the following represents normal respiration?",
    options: patternsOfBreathingData,
    answers: ["Eupnoea"],
  },
  {
    type: "multiple-select",
    question:
      "PATTERNS OF BREATHING: Which of the following represents rapid respiration?",
    options: patternsOfBreathingData,
    answers: ["Tachypnoea"],
  },
  {
    type: "multiple-select",
    question:
      "PATTERNS OF BREATHING: Which of the following represents slow and regular respiration?",
    options: patternsOfBreathingData,
    answers: ["Bradypnoea"],
  },
  {
    type: "multiple-select",
    question:
      "PATTERNS OF BREATHING: Which of the following represents when the respiratory rate and depth are irregular, characterised by alternating periods of apnoea and hyperventilation?",
    options: patternsOfBreathingData,
    answers: ["Cheyne-Stokes"],
  },
  {
    type: "multiple-select",
    question:
      "PATTERNS OF BREATHING: Which of the following represents irregular in depth and rate, with periods of apnoea?",
    options: patternsOfBreathingData,
    answers: ["Biot's or ataxic"],
  },
  {
    type: "multiple-select",
    question:
      "PATTERNS OF BREATHING: Which of the following represents deep, rapid respiration?",
    options: patternsOfBreathingData,
    answers: ["Kussmaul"],
  },
  {
    type: "multiple-select",
    question:
      "PATTERNS OF BREATHING: Which of the following represents expiration against partially closed lips?",
    options: patternsOfBreathingData,
    answers: ["Pursed-lip breathing"],
  },
  {
    type: "multiple-select",
    question:
      "PATTERNS OF BREATHING: Which of the following represents a rate and depth of respirations increase?",
    options: patternsOfBreathingData,
    answers: ["Hyperventilation"],
  },
  {
    type: "multiple-select",
    question:
      "PATTERNS OF BREATHING: Which of the following represents when depth of ventilation is shallow and depressed?",
    options: patternsOfBreathingData,
    answers: ["Hypoventilation"],
  },
  {
    type: "multiple-select",
    question: "RESPIRATORY RATE: What is the respiratory rate of a newborn?",
    options: rrData,
    answers: ["30\u201360"],
  },
  {
    type: "multiple-select",
    question:
      "RESPIRATORY RATE: What is the respiratory rate of an infant (6 months)?",
    options: rrData,
    answers: ["30\u201350"],
  },
  {
    type: "multiple-select",
    question:
      "RESPIRATORY RATE: What is the respiratory rate of a toddler (2 years)?",
    options: rrData,
    answers: ["25\u201332"],
  },
  {
    type: "multiple-select",
    question: "RESPIRATORY RATE: What is the respiratory rate of a child?",
    options: rrData,
    answers: ["20\u201330"],
  },
  {
    type: "multiple-select",
    question:
      "RESPIRATORY RATE: What is the respiratory rate of an adolescent?",
    options: rrData,
    answers: ["16\u201319"],
  },
  {
    type: "multiple-select",
    question: "RESPIRATORY RATE: What is the respiratory rate of an adult?",
    options: rrData,
    answers: ["12\u201320"],
  },
];

const breathingWrittenData = [
  {
    type: "written",
    question: "What is the medical term for normal, unlabored breathing?",
    answers: ["Eupnoea"],
  },
  {
    type: "long-response",
    question: "What is the medical term for unlabored breathing?",
    answers: ["Eupnoea"],
  },
  {
    type: "written-ordered",
    question:
      "List the first two stages of the ABCDE clinical assessment protocol:",
    answers: ["Airway", "Breathing"],
  },
];

const circulationBasicData = [
  {
    type: "multiple-select",
    question: "CIRCULATION: What is a normal adult heart rate?",
    options: ["60–100 bpm", "40–50 bpm", "120–160 bpm"],
    answers: ["60–100 bpm"],
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
          : breathingBasicData;

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
              <input
                type="text"
                placeholder="Type your answer here..."
                value={userAnswers[item.id] || ""}
                onChange={(e) => updateAnswer(item.id, e.target.value)}
                style={{ width: "100%", padding: "10px" }}
              />
            )}

            {/* TYPE: Long Response */}
            {item.type === "long-response" && (
              <input
                type="text"
                placeholder="Type your answer here..."
                value={userAnswers[item.id] || ""}
                onChange={(e) => updateAnswer(item.id, e.target.value)}
                style={{ width: "100%", padding: "10px" }}
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
                    ? "ⓘ Info"
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
