// src/components/pages/ProfessionalQuiz.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./professionalQuiz.css";

export default function ProfessionalQuiz({
  initialType = "mixed",
  questions = null,
  timePerQuestion = 30,
  sounds = {
    background:"/sounds/background_loop.mp3",
    correct: "/sounds/correct.mp3",
    wrong: "/sounds/wrong.mp3",
    click: "/sounds/click.mp3",
    applause: "/sounds/applause.mp3",
  },
  onComplete = null,
}) {
  /* ---------------- QUESTIONS ---------------- */
  const sampleQuestions = useMemo(
    () => [
      {
        id: "mc1",
        type: "mcq",
        q: "Which language runs in a web browser?",
        options: ["Python", "C#", "JavaScript", "Java"],
        answer: 2,
        correctFeedback: "Correct! JavaScript runs in browsers.",
        incorrectFeedback: "Incorrect. JavaScript is correct.",
      },
    ],
    []
  );

  const bank = questions?.length ? questions : sampleQuestions;
  const quizList = useMemo(
    () => (initialType === "mixed" ? bank : bank.filter(q => q.type === initialType)),
    [bank, initialType]
  );

  /* ---------------- STATE ---------------- */
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(timePerQuestion);
  const [showFeedback, setShowFeedback] = useState(null);
  const [muted, setMuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  /* ---------------- AUDIO (FIXED) ---------------- */
  const audioCorrect = useRef(new Audio(sounds.correct));
  const audioWrong = useRef(new Audio(sounds.wrong));
  const audioClick = useRef(new Audio(sounds.click));
  const audioApplause = useRef(new Audio(sounds.applause));
  const bgMusic = useRef(new Audio(sounds.background));


  // one-time setup
  useEffect(() => {
    [audioCorrect, audioWrong, audioClick, audioApplause].forEach(ref => {
      ref.current.preload = "auto";
      ref.current.load();
    });
  }, []);

  // sync mute
  useEffect(() => {
    [audioCorrect, audioWrong, audioClick, audioApplause].forEach(ref => {
      ref.current.muted = muted;
    });
  }, [muted]);

  function play(ref) {
    if (!audioUnlocked || muted) return;
    try {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    } catch {}
  }
  useEffect(() => {
  bgMusic.current.loop = true;
  bgMusic.current.volume = 0.35; // softer than effects
  bgMusic.current.preload = "auto";
  bgMusic.current.load();
}, []);
useEffect(() => {
  bgMusic.current.muted = muted;
}, [muted]);
useEffect(() => {
  return () => {
    try {
      bgMusic.current.pause();
      bgMusic.current.currentTime = 0;
    } catch {}
  };
}, []);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!timePerQuestion || showResult) return;
    setTimer(timePerQuestion);

    const t = setInterval(() => {
      setTimer(s => {
        if (s <= 1) {
          clearInterval(t);
          handleAnswer(null, true);
          return timePerQuestion;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [index, showResult, timePerQuestion]);

  /* ---------------- ANSWER ---------------- */
  function handleAnswer(given, timedOut = false) {
    if (!audioUnlocked) {
  setAudioUnlocked(true);
  if (!muted) {
    try {
      bgMusic.current.currentTime = 0;
      bgMusic.current.play().catch(() => {});
    } catch {}
  }
}


    const correct = current.type === "mcq" ? given === current.answer : false;

    setAnswers(s => ({ ...s, [current.id]: { given, correct, timedOut } }));

    if (correct) {
      setScore(s => s + 1);
      play(audioCorrect);
      setShowFeedback({ type: "correct", text: current.correctFeedback });
    } else {
      play(audioWrong);
      setShowFeedback({ type: "incorrect", text: current.incorrectFeedback });
    }

    setTimeout(() => {
      setShowFeedback(null);
      index + 1 < quizList.length ? setIndex(i => i + 1) : finishQuiz();
    }, 1200);
  }

  /* ---------------- FINISH ---------------- */
  function finishQuiz() {
  try {
    bgMusic.current.pause();
    bgMusic.current.currentTime = 0;
  } catch {}

  play(audioApplause);

  setShowResult(true);
  onComplete?.({ score, total: quizList.length, details: answers });
}


  /* ---------------- UI ---------------- */
  const current = quizList[index];
  const progress = Math.round((index / quizList.length) * 100);

  return (
  <div className="quiz-desktop">
    <div className="quiz-root">
      

      <div className="quiz-card">
        {!showResult ? (
          <>
            <div className="quiz-header">
              <span>Question {index + 1}/{quizList.length}</span>
              <div className="quiz-header-right">
                <span className="quiz-score">Score: {score}</span>
                <button className="quiz-mute-btn" onClick={() => setMuted(m => !m)}>
                  {muted ? "🔇" : "🔊"}
                </button>
              </div>
            </div>

            <div className="quiz-progress">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }} 
              />
            </div>

            {current && (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="quiz-question">{current.q}</h2>
                <div className="quiz-options">
                  {current.options.map((opt, i) => {
                    const ans = answers[current.id];
                    const isCorrect = ans && i === current.answer;
                    const isWrong = ans && ans.given === i && !ans.correct;

                    return (
                      <button
                        key={i}
                        disabled={ans}
                        onClick={() => handleAnswer(i)}
                        className={`quiz-option ${isCorrect ? "correct" : isWrong ? "incorrect" : ""}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
            <div className="quiz-feedback-container">
    <AnimatePresence>
      {showFeedback && (
        <motion.div
          className={`quiz-feedback ${showFeedback.type}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          {showFeedback.text}
        </motion.div>
      )}
    </AnimatePresence>
  </div>

            <div className="quiz-footer">
              <span className="quiz-timer">⏱ {timer}s</span>
              {index === quizList.length - 1 && answers[current.id] && (
                <div className="quiz-finish-wrapper">
                  <button className="quiz-finish-btn" onClick={finishQuiz}>
                    See Results
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* RESULT VIEW INSIDE CARD */
          <motion.div 
            className="quiz-result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h1 style={{ fontSize: '48px' }}>🎉</h1>
            <h2>Quiz Completed!</h2>
            <div className="quiz-score-display" style={{ fontSize: '24px', margin: '20px 0', color: '#00c3d0', fontWeight: '800' }}>
              Final Score: {score} / {quizList.length}
            </div>
            <button className="quiz-finish-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  </div>
);
}
