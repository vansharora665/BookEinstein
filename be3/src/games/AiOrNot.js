import React, { useState, useEffect } from "react";
import "./aiOrNot.css";
import { quizQuestions, difficultyLevels } from "./AiOrNotquestions";

const aiOptions = ["Learn", "Think", "Decide", "Recognize"];

export default function AIImageQuiz() {
  /* ===============================
     HELPERS
  =============================== */

  const normalizeImageUrl = (url) =>
    url ? url.replace("hhttps://", "https://") : "";

  const normalizeAiType = (aiType) =>
    Array.isArray(aiType) ? aiType : aiType ? [aiType] : [];

  const isExactMatch = (selected, correct) => {
    if (selected.length !== correct.length) return false;
    return correct.every(c => selected.includes(c));
  };

  /* ===============================
     STATE
  =============================== */

  const [studentLevel, setStudentLevel] = useState(
    difficultyLevels.indexOf("medium")
  );
  const [usedQuestions, setUsedQuestions] = useState(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [activeDifficulty, setActiveDifficulty] = useState(null);

  const [showAIDetails, setShowAIDetails] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const [feedback, setFeedback] = useState("");
  const [imageError, setImageError] = useState(false);

  /* ===============================
     INIT
  =============================== */

  useEffect(() => {
    pickNextQuestion(studentLevel, usedQuestions);
    // eslint-disable-next-line
  }, []);

  /* ===============================
     ADAPTIVE LOGIC
  =============================== */

  const getNextStudentLevel = (current, correct) => {
    if (correct && current === difficultyLevels.length - 1) return current;
    if (!correct && current === 0) return current;
    return correct ? current + 1 : current - 1;
  };

  const pickNextQuestion = (level, usedSet) => {
    for (let i = level; i >= 0; i--) {
      const q = quizQuestions.find(
        q =>
          q.difficulty === difficultyLevels[i] &&
          !usedSet.has(q.id)
      );
      if (q) {
        setCurrentQuestion(q);
        setActiveDifficulty(difficultyLevels[i]);
        setShowAIDetails(false);
        setSelectedOptions([]);
        setSubmitted(false);
        setIsCorrect(null);
        setFeedback("");
        setImageError(false);
        return;
      }
    }
    setCurrentQuestion(null);
  };

  const goNext = (correct) => {
    const nextLevel = getNextStudentLevel(studentLevel, correct);
    const newUsed = new Set(usedQuestions);
    newUsed.add(currentQuestion.id);

    setTimeout(() => {
      setStudentLevel(nextLevel);
      setUsedQuestions(newUsed);
      pickNextQuestion(nextLevel, newUsed);
    }, 1200);
  };

  /* ===============================
     HANDLERS
  =============================== */

  const handleAISelection = (answer) => {
    const isAIQuestion =
      currentQuestion?.isAI ?? currentQuestion?.isAi;

    const correct = answer === isAIQuestion;

    if (correct && answer === true) {
      setShowAIDetails(true);
      setFeedback("Select all applicable AI abilities");
    } else {
      setFeedback(correct ? "Correct!" : "Incorrect!");
      goNext(correct);
    }
  };

  const toggleOption = (opt) => {
    if (submitted) return;

    setSelectedOptions(prev =>
      prev.includes(opt)
        ? prev.filter(o => o !== opt)
        : [...prev, opt]
    );
  };

  const handleSubmit = () => {
    const correctTypes = normalizeAiType(currentQuestion.aiType);
    const correct = isExactMatch(selectedOptions, correctTypes);

    setSubmitted(true);
    setIsCorrect(correct);
    setFeedback(
      correct
        ? "✅ Correct!"
        : "❌ Incorrect — correct answers highlighted"
    );

    goNext(correct);
  };

  /* ===============================
     END STATE
  =============================== */

  if (!currentQuestion) {
    return (
      <div className="quiz-end">
        <h2>🎉 Quiz Completed</h2>
        <p>
          Final Difficulty:{" "}
          <span>{difficultyLevels[studentLevel]}</span>
        </p>
      </div>
    );
  }

  /* ===============================
     RENDER
  =============================== */

  const imageUrl = normalizeImageUrl(currentQuestion.image);
  const correctAnswers = normalizeAiType(currentQuestion.aiType);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3>AI Identification Quiz</h3>
        <div className="difficulty-badge">
          {activeDifficulty?.toUpperCase()}
        </div>
      </div>

      <div className="image-wrapper">
        {!imageError ? (
          <img
            src={imageUrl}
            alt="Quiz"
            className="quiz-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-fallback">⚠️ Image unavailable</div>
        )}
      </div>

      <div className="options-container">
        {!showAIDetails ? (
          <div className="options-grid">
            <button
              className="quiz-btn primary"
              onClick={() => handleAISelection(true)}
            >
              🤖 AI Generated
            </button>
            <button
              className="quiz-btn"
              onClick={() => handleAISelection(false)}
            >
              📸 Real Photo
            </button>
          </div>
        ) : (
          <>
            <div className="options-grid">
              {aiOptions.map(opt => {
                const isSelected = selectedOptions.includes(opt);
                const isCorrectAnswer =
                  submitted && correctAnswers.includes(opt);

                return (
                  <button
                    key={opt}
                    className={`quiz-btn
                      ${isSelected ? "selected" : ""}
                      ${isCorrectAnswer ? "correct-answer" : ""}
                      ${
                        submitted &&
                        isSelected &&
                        !isCorrectAnswer
                          ? "wrong-answer"
                          : ""
                      }
                    `}
                    onClick={() => toggleOption(opt)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <button
              className="quiz-btn submit"
              disabled={selectedOptions.length === 0 || submitted}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </>
        )}
      </div>

      {feedback && (
        <div
          className={`feedback-overlay ${
            isCorrect === true
              ? "correct"
              : isCorrect === false
              ? "incorrect"
              : ""
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
}
