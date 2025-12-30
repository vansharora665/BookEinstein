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
    bgMusic.current.currentTime = 0;
    bgMusic.current.play().catch(() => {});
  }
}

    const q = quizList[index];
    if (!q || answers[q.id]) return;

    // 🔑 unlock audio on first interaction
    if (!audioUnlocked) setAudioUnlocked(true);

    const correct = q.type === "mcq" ? given === q.answer : false;

    setAnswers(s => ({ ...s, [q.id]: { given, correct, timedOut } }));

    if (correct) {
      setScore(s => s + 1);
      play(audioCorrect);
      setShowFeedback({ type: "correct", text: q.correctFeedback });
    } else {
      play(audioWrong);
      setShowFeedback({ type: "incorrect", text: q.incorrectFeedback });
    }

    setTimeout(() => {
      setShowFeedback(null);
      index + 1 < quizList.length ? setIndex(i => i + 1) : finishQuiz();
    }, 1200);
  }

  /* ---------------- FINISH ---------------- */
  function finishQuiz() {
    play(audioApplause);
    try {
  bgMusic.current.pause();
} catch {}

    setShowResult(true);
    onComplete?.({ score, total: quizList.length, details: answers });
  }

  /* ---------------- UI ---------------- */
  const current = quizList[index];
  const progress = Math.round((index / quizList.length) * 100);

  return (
    <div className="quiz-root">
      {/* FEEDBACK */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            className={`quiz-feedback ${showFeedback.type}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {showFeedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="quiz-card">
        <div className="quiz-header">
          <span>Question {index + 1}/{quizList.length}</span>
          <div className="quiz-header-right">
            <span className="quiz-score">{score}</span>
            <button
              className="quiz-mute-btn"
              onClick={() => setMuted(m => !m)}
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>

        <div className="quiz-progress">
          <div style={{ width: `${progress}%` }} />
        </div>

        {current && (
          <>
            <h2 className="quiz-question">{current.q}</h2>

            <div className="quiz-options">
              {current.options.map((opt, i) => {
                const ans = answers[current.id];
                const correct = ans && i === current.answer;
                const wrong = ans && ans.given === i && !ans.correct;

                return (
                  <button
                    key={i}
                    disabled={ans}
                    onClick={() => handleAnswer(i)}
                    className={`quiz-option ${correct ? "correct" : wrong ? "incorrect" : ""}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* FOOTER CONTROLS */}
        <div className="quiz-footer">
          <span className="quiz-timer">{timer}s</span>

          {/* 🔥 NEW FINISH BUTTON */}
          <div className="quiz-finish-wrapper">
  <button
    className="quiz-finish-btn"
    onClick={finishQuiz}
  >
    Finish Quiz
  </button>
</div>

        </div>
      </div>

      {showResult && (
        <div className="quiz-result">
          <h2>Quiz Completed 🎉</h2>
          <p>Score: {score}/{quizList.length}</p>
        </div>
      )}
    </div>
  );
}
