const { useState, useEffect } = React;

const foundationCategorisationQuestion = ["Anatomy", "Physiology"];
const foundationsAnPData = [
  {
    type: "multiple-select",
    question:
      "Measuring the electrical activity of the heart using an electrocardiogram (ECG)",
    options: foundationCategorisationQuestion,
    answers: ["Physiology"],
  },
  {
    type: "multiple-select",
    question:
      "Identifying the lobes, fissures, and sulci of the human brain during a dissection lab.",
    options: foundationCategorisationQuestion,
    answers: ["Anatomy"],
  },
  {
    type: "multiple-select",
    question:
      "Using an electron microscope to examine the structural layers of a cell membrane.",
    options: foundationCategorisationQuestion,
    answers: ["Anatomy"],
  },
  {
    type: "multiple-select",
    question:
      "Investigating how the rate of oxygen diffusion across alveolar walls changes during exercise.",
    options: foundationCategorisationQuestion,
    answers: ["Physiology"],
  },
  {
    type: "multiple-select",
    question:
      "Performing a biopsy to check for abnormal cell arrangements in epithelial tissue.",
    options: foundationCategorisationQuestion,
    answers: ["Anatomy"],
  },
  {
    type: "multiple-select",
    question:
      "Testing how varying levels of hormone binding affect glucose uptake in skeletal muscle cells.",
    options: foundationCategorisationQuestion,
    answers: ["Physiology"],
  },
  {
    type: "long-response",
    question: "What does the scientific study of anatomy encompass?",
    answers: [
      "Anatomy is the scientific study of the physical structure of organisms, including their systems, organs and tissues. The word comes from the Greek for 'dissection'. Anatomy refers to how we identify and describe the parts of the body, how they relate to one another, and what they are made of. Studying anatomy gives us a biological map of our cells, tissues, organs and organ systems.",
    ],
  },
  {
    type: "long-response",
    question: "What does the scientific study of physiology encompass?",
    answers: [
      "Physiology is the scientific study of how living organisms, their organs, tissues and cells function. It focuses on the chemical and physical mechanisms of biological systems, exploring everything from microscopic molecular interactions to whole-body processes to understand how life is sustained, how it adapts, and what causes dysfunction. Physiology answers questions about how the body works, what happens when we are born and develop, how body systems adapt to stresses such as exercise or environmental extremes, and how body functions change in disease states.",
    ],
  },
  {
    type: "long-response",
    question: "What is homeostasis?",
    answers: [
      "Homeostasis is the biological process by which a living organism regulates its internal environment to maintain stability and function properly, despite changes in external conditions. When homeostasis functions properly, your body is able to fight off illnesses, recover from injuries, and run daily functions efficiently. When it fails or experiences a homeostatic imbalance, it can result in diseases, disorders, or even death.",
    ],
  },
  {
    type: "long-response",
    question: "What are the two main types of human anatomy?",
    answers: [
      "Anatomy is usually divided it into two main types: *macroscopic anatomy* (sometimes called *gross anatomy*) and *microscopic anatomy*. \n \n Macroscopic anatomy is the study of structures in the body that you can see with the naked eye, such as internal organs, bones and muscles. \n \n On the other hand, microscopic anatomy focuses on structures that are too small to see with the naked eye, so we need tools like microscopes. This includes looking at cells and understanding how they work together to build larger organs.",
    ],
  },
  {
    type: "long-response",
    question:
      "What are the two general approaches to the study of gross anatomy?",
    answers: [
      "There are two main ways to study anatomy: *regional anatomy* and *systemic anatomy*. \n \n Regional anatomy involves examining all the structures within a particular body region, such as the abdomen, and how they relate to one another in that space. This approach helps us understand how different parts work together in one location. \n \n On the other hand, systemic anatomy focuses on the structures that make up a single body system. Here, we look at groups of structures that work together to perform a specific function, such as the organs involved in digestion.",
    ],
  },
  {
    type: "long-response",
    question:
      "What are the two general approaches to the study of microscopic anatomy?",
    answers: [
      "There are two main ways to study microscopic anatomy: *cytology* and *histology*. Cytology involves studying the internal structures, formation and function of individual cells.  On the other hand, histology focuses on the structure of biological tissues and how those cells are organised to form organs.",
    ],
  },
];

const organisationData = [
  {
    type: "written-ordered",
    question:
      "What are the six structural levels of organisation of the human body, from simplest to most complex?",
    extraBoxes: 1,
    answers: [
      ["Chemical level", "Chemical"],
      ["Cellular level", "Cells", "Cellular"],
      ["Tissue level", "Tissues", "Tissue"],
      ["Organ level", "Organs", "Organ"],
      ["Organ system level", "Organ systems", "System level", "Organ system"],
      ["Organismal level", "Organism", "Organisms"],
    ],
  },
];

const Quiz = ({ quizType, onBack }) => {
  const renderItalics = (text) => {
    if (!text) return "";

    const italicsParts = text.split(/\*(.*?)\*/g);

    return italicsParts.map((part, index) => {
      if (index % 2 === 1) {
        return <em key={index}>{part}</em>;
      }

      return part;
    });
  };

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

  const QUIZ_DATA_MAP = {
    "organisation-quiz": organisationData,
    "foundations-A-and-P": foundationsAnPData,
  };

  const handleRandomise = () => {
    const selectedData = QUIZ_DATA_MAP[quizType];

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

      if (cleanInputs.length !== item.answers.length) return false;

      return item.answers.every((acceptableAnswers, index) => {
        const userVal = (input[index] || "").trim().toLowerCase();
        return acceptableAnswers.some(
          (ans) => ans.trim().toLowerCase() === userVal,
        );
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

  const formatExpectedAnswers = (item) => {
    if (item.type === "written-ordered" || item.type === "written-ordered-cs") {
      return item.answers.map((ansGroup, index) => {
        const primary = ansGroup[0];
        const variations = ansGroup.slice(1);

        return variations.length > 0
          ? `${index + 1}. ${primary} (or: ${variations.join(", ")})`
          : `${index + 1}. ${primary}`;
      });
    }

    return [item.answers.join(", ")];
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
                  <div>
                    <span
                      style={{
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "5px",
                      }}
                    >
                      Expected Sequence:
                    </span>
                    {formatExpectedAnswers(item).map((line, index) => (
                      <p
                        key={index}
                        style={{
                          margin: "2px 0",
                          fontSize: "0.95em",
                          paddingLeft: "5px",
                        }}
                      >
                        {renderItalics(line)}
                      </p>
                    ))}
                  </div>
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
