import React, { useState, useMemo } from "react";
import "./aiOrNot.css";
import { quizQuestions, difficultyLevels } from "./AiOrNotquestions";

const aiOptions = ["learn", "Think", "Decide", "Recogonize"];

export default function AIImageQuiz() {
  // ✅ Single source of truth
  const [studentLevel, setStudentLevel] = useState(
    difficultyLevels.indexOf("medium")
  );
  const [usedQuestions, setUsedQuestions] = useState(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAIDetails, setShowAIDetails] = useState(false);
  const [feedback, setFeedback] = useState("");

  // ✅ Pick the first question on mount
  React.useEffect(() => {
    pickNextQuestion(studentLevel, usedQuestions);
    // eslint-disable-next-line
  }, []);

  // ----------------------------
  // CORE ADAPTIVE LOGIC
  // ----------------------------

  const getNextStudentLevel = (current, correct) => {
    if (correct && current === difficultyLevels.length - 1) return current;
    if (!correct && current === 0) return current;
    return correct ? current + 1 : current - 1;
  };

  const pickNextQuestion = (level, usedSet) => {
    for (let i = level; i >= 0; i--) {
      const q = quizQuestions.find(
        (q) =>
          q.difficulty === difficultyLevels[i] &&
          !usedSet.has(q.id)
      );
      if (q) {
        setCurrentQuestion(q);
        return;
      }
    }
    setCurrentQuestion(null); // quiz over
  };

  const goNext = (correct) => {
    const nextLevel = getNextStudentLevel(studentLevel, correct);
    const newUsed = new Set(usedQuestions);
    newUsed.add(currentQuestion.id);

    setTimeout(() => {
      setStudentLevel(nextLevel);
      setUsedQuestions(newUsed);
      setShowAIDetails(false);
      setFeedback("");
      pickNextQuestion(nextLevel, newUsed);
    }, 700);
  };

  // ----------------------------
  // HANDLERS
  // ----------------------------

  const handleAISelection = (answer) => {
    const correct = answer === currentQuestion.isAI;

    if (correct && answer === true) {
      setFeedback("Correct! Identify the AI technique.");
      setShowAIDetails(true);
    } else {
      setFeedback(correct ? "Correct!" : "Incorrect!");
      goNext(correct);
    }
  };

  const handleAITypeSelection = (type) => {
    const correct = type === currentQuestion.aiType;
    setFeedback(correct ? "Correct AI technique!" : "Wrong technique!");
    goNext(correct);
  };

  // ----------------------------
  // END STATE
  // ----------------------------

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

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3>
          Difficulty:{" "}
          <span>{difficultyLevels[studentLevel]}</span>
        </h3>
      </div>

      <img
        src={currentQuestion.image}
        alt="AI Quiz"
        className="quiz-image"
      />

      {!showAIDetails ? (
        <div className="options">
          <button onClick={() => handleAISelection(true)}>
            AI Generated
          </button>
          <button onClick={() => handleAISelection(false)}>
            Not AI
          </button>
        </div>
      ) : (
        <div className="options">
          {aiOptions.map((opt) => (
            <button key={opt} onClick={() => handleAITypeSelection(opt)}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}