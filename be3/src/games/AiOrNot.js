import React, { useState, useMemo, useEffect } from "react";
import "./aiOrNot.css";
import { quizQuestions, difficultyLevels } from "./AiOrNotquestions";

const aiOptions = ["learn", "Think", "Decide", "Recogonize"];

export default function AIImageQuiz() {


  function normalizeDriveImage(url) {
  if (!url) return "";

  // fix typo
  url = url.replace("hhttps://", "https://");

  // already correct
  if (url.includes("uc?export=view&id=")) return url;

  // extract ID from /file/d/
  const match = url.match(/\/d\/([^/]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }

  return url;
}

  /* ===============================
     STATE
  =============================== */
  const [studentLevel, setStudentLevel] = useState(
    difficultyLevels.indexOf("medium")
  );
  const [usedQuestions, setUsedQuestions] = useState(new Set());
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAIDetails, setShowAIDetails] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [imageSrc, setImageSrc] = useState(null);

  /* ===============================
     INITIAL QUESTION
  =============================== */
  useEffect(() => {
    pickNextQuestion(studentLevel, usedQuestions);
    // eslint-disable-next-line
  }, []);

  /* ===============================
     GOOGLE DRIVE IMAGE FIX (BLOB)
  =============================== */
  useEffect(() => {
    let active = true;

    async function loadImage() {
      try {
        const res = await fetch(currentQuestion.image);
        const blob = await res.blob();

        // Drive sometimes returns HTML
        if (!blob.type.startsWith("image")) {
          throw new Error("Not an image");
        }

        const objectUrl = URL.createObjectURL(blob);
        if (active) setImageSrc(objectUrl);
      } catch (err) {
        console.error("Image load failed:", err);
        if (active) setImageSrc(null);
      }
    }

    if (currentQuestion?.image) {
      loadImage();
    }

    return () => {
      active = false;
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [currentQuestion]);

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
        return;
      }
    }
    setCurrentQuestion(null);
  };

  const goNext = correct => {
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

  /* ===============================
     HANDLERS
  =============================== */
  const handleAISelection = answer => {
    const correct = answer === currentQuestion.isAI;

    if (correct && answer === true) {
      setFeedback("Correct! Identify the AI technique.");
      setShowAIDetails(true);
    } else {
      setFeedback(correct ? "Correct!" : "Incorrect!");
      goNext(correct);
    }
  };

  const handleAITypeSelection = type => {
    const correct = type === currentQuestion.aiType;
    setFeedback(correct ? "Correct AI technique!" : "Wrong technique!");
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
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3>
          Difficulty:{" "}
          <span>{difficultyLevels[studentLevel]}</span>
        </h3>
      </div>

      {imageSrc ? (
        <img
          src={normalizeDriveImage(imageSrc)}
          alt="AI Quiz"
          className="quiz-image"
        />
      ) : (
        <div className="image-loading">
          Loading image...
        </div>
      )}

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
          {aiOptions.map(opt => (
            <button
              key={opt}
              onClick={() => handleAITypeSelection(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
}
