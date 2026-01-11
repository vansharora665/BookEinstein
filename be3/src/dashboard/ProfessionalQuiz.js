import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./professionalQuiz.css";

/* =====================================
   DIFFICULTY LADDER
===================================== */
const LEVELS = [
  "very easy",
  "easy",
  "medium",
  "difficult",
  "very difficult",
];

const START_LEVEL_INDEX = 2; // medium

export default function ProfessionalQuiz({
  questions = [],
  timePerQuestion = 30,
  sounds = {
    background: "/sounds/background_loop.mp3",
    correct: "/sounds/correct.mp3",
    wrong: "/sounds/wrong.mp3",
    applause: "/sounds/applause.mp3",
  },
  onComplete,
}) {
  /* =====================================
     NORMALIZE QUESTIONS
  ===================================== */
  const normalizedQuestions = useMemo(() => {
  return (questions || []).map((q, idx) => {
    const optionMap = {
      A: q.quizOptionA,
      B: q.quizOptionB,
      C: q.quizOptionC,
      D: q.quizOptionD,
    };

    const options = q.quizQuestion
      ? Object.values(optionMap).filter(Boolean)
      : q.options;

    const correctIndex = q.quizQuestion
      ? options.indexOf(optionMap[q.correctAnswer])
      : q.answer;

    return {
      id: q.id ?? idx,
      question: q.quizQuestion ?? q.q,
      options,
      correctIndex,
      difficulty: q.quizDifficulty
        ?.toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " "),
      correctFeedback: q.quizCorrectFeedback ?? "Correct!",
      incorrectFeedback: q.quizIncorrectFeedback ?? "Incorrect",
    };
  });
}, [questions]);


  /* =====================================
     STATE
  ===================================== */
  const [hasStarted, setHasStarted] = useState(false);
  const [levelIndex, setLevelIndex] = useState(START_LEVEL_INDEX);
  const [usedIds, setUsedIds] = useState(new Set());
  const [current, setCurrent] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(timePerQuestion);
  const [feedback, setFeedback] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [muted, setMuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const audioCorrect = useRef(new Audio(sounds.correct));
  const audioWrong = useRef(new Audio(sounds.wrong));
  const audioApplause = useRef(new Audio(sounds.applause));
  const bgMusic = useRef(new Audio(sounds.background));

  const play = (ref) => {
    if (!audioUnlocked || muted) return;
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  };

  /* =====================================
     FIXED QUESTION PICKER
  ===================================== */
  const pickNextQuestion = (targetLvlIdx, usedSet) => {
    // Keep index within array bounds
    const safeIdx = Math.max(0, Math.min(targetLvlIdx, LEVELS.length - 1));
    const targetDifficultyName = LEVELS[safeIdx];

    const available = normalizedQuestions.filter(
      (q) => q.difficulty === targetDifficultyName && !usedSet.has(q.id)
    );

    if (available.length > 0) {
      return {
        question: available[Math.floor(Math.random() * available.length)],
        levelIndex: safeIdx,
      };
    }

    // Fallback: If no question exists at that specific difficulty, pick ANY unused question
    const fallback = normalizedQuestions.find((q) => !usedSet.has(q.id));
    if (fallback) {
      // Find the level index of the fallback question so UI stays in sync
      const fallbackLvlIdx = LEVELS.indexOf(fallback.difficulty);
      return {
        question: fallback,
        levelIndex: fallbackLvlIdx !== -1 ? fallbackLvlIdx : safeIdx,
      };
    }

    return null; // No questions left at all
  };

  /* =====================================
     HANDLERS
  ===================================== */
  function startQuiz() {
    if (normalizedQuestions.length === 0) return;
    
    setHasStarted(true);
    setAudioUnlocked(true);

    if (!muted) {
      bgMusic.current.loop = true;
      bgMusic.current.volume = 0.35;
      bgMusic.current.play().catch(() => {});
    }

    const first = pickNextQuestion(START_LEVEL_INDEX, new Set());
    if (first) {
      setCurrent(first.question);
      setLevelIndex(first.levelIndex);
    } else {
      setShowResult(true);
    }
  }

  function handleAnswer(selectedIndex, timedOut = false) {
    const isCorrect = !timedOut && selectedIndex === current.correctIndex;

    if (isCorrect) {
      setScore((s) => s + 1);
      play(audioCorrect);
    } else {
      play(audioWrong);
    }

    setFeedback({
      type: isCorrect ? "correct" : "incorrect",
      text: isCorrect
        ? current.correctFeedback
        : timedOut
        ? "⏱ Time’s up!"
        : current.incorrectFeedback,
    });

    const newUsed = new Set(usedIds);
    newUsed.add(current.id);
    setUsedIds(newUsed);

    setTimeout(() => {
      setFeedback(null);
      
      // If correct, increase difficulty (+1). If wrong, decrease (-1).
      const nextLvl = isCorrect ? levelIndex + 1 : levelIndex - 1;
      const next = pickNextQuestion(nextLvl, newUsed);

      if (!next || newUsed.size >= 10) { // Limits to 10 questions total
        finishQuiz();
      } else {
        setLevelIndex(next.levelIndex);
        setCurrent(next.question);
      }
    }, 1800);
  }

  function finishQuiz() {
    bgMusic.current.pause();
    play(audioApplause);
    setShowResult(true);
    onComplete?.({ score, total: usedIds.size });
  }

  /* =====================================
     TIMER EFFECT
  ===================================== */
  useEffect(() => {
    if (!hasStarted || !current || showResult || feedback) return;
    setTimer(timePerQuestion);
    const t = setInterval(() => {
      setTimer((s) => {
        if (s <= 1) {
          clearInterval(t);
          handleAnswer(null, true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [current, hasStarted, showResult, feedback]);

  /* =====================================
     RENDER
  ===================================== */
  return (
    <div className="quiz-container-adaptive">
      <div className="quiz-desktop">
        <div className="quiz-root">
          <div className="quiz-card">
            {!hasStarted ? (
              <div className="quiz-result">
                <h1 style={{ fontSize: "50px" }}>🚀</h1>
                <h2>Professional Quiz</h2>
                <p>Starting Difficulty: <strong>Medium</strong></p>
                <button className="quiz-finish-btn" onClick={startQuiz}>
                  Start Quiz
                </button>
              </div>
            ) : !showResult ? (
              <>
                <div className="quiz-header">
                  <span>Difficulty: <strong>{LEVELS[levelIndex].toUpperCase()}</strong></span>
                  <div className="quiz-header-right">
                    <span className="quiz-score">Score: {score}</span>
                    <button className="quiz-mute-btn" onClick={() => setMuted((m) => !m)}>
                      {muted ? "🔇" : "🔊"}
                    </button>
                  </div>
                </div>

                <div className="quiz-progress">
                  <motion.div animate={{ width: `${(usedIds.size / 10) * 100}%` }} />
                </div>

                {current && (
                  <motion.div key={current.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="quiz-question">{current.question}</h2>
                    <div className="quiz-options">
                      {current.options.map((opt, i) => (
                        <button
                          key={i}
                          disabled={!!feedback}
                          onClick={() => handleAnswer(i)}
                          className={`quiz-option ${feedback && i === current.correctIndex ? 'correct' : ''}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="quiz-feedback-container">
                  <AnimatePresence>
                    {feedback && (
                      <motion.div
                        className={`quiz-feedback ${feedback.type}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        {feedback.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="quiz-footer">
                  <span className="quiz-timer">⏱ {timer}s</span>
                  <span>Question {usedIds.size + 1} / 10</span>
                </div>
              </>
            ) : (
              <div className="quiz-result">
                <h1 style={{ fontSize: "60px" }}>🎯</h1>
                <h2>Results</h2>
                <div className="quiz-score-display">{score} / {usedIds.size}</div>
                <button className="quiz-finish-btn" onClick={() => window.location.reload()}>
                  Restart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}