// src/components/pages/ProfessionalQuiz.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./professionalQuiz.css";

/**
 * ProfessionalQuiz
 *
 * Props:
 *  - initialType: "mixed" | "mcq" | "truefalse" | "fill"  (default "mixed")
 *  - questions: array of questions (preferred). Each question:
 *      { id, type: 'mcq'|'truefalse'|'fill', q: 'Question', options?: [], answer: index|true|'text', hint?: '...', difficulty?: 'Easy'|'Medium'|'Hard', correctFeedback?: '...', incorrectFeedback?: '...' }
 *  - timePerQuestion: seconds (0 disables timer). default 30
 *  - sounds: { correct, wrong, click, applause } (URLs in public/)
 *  - theme: string token for accent choices (keeps some original behavior)
 *  - onComplete: callback({ score, total, details })
 *
 * NOTE: class names module-primary-btn / module-secondary-btn etc used so quiz matches site styles.
 */

export default function ProfessionalQuiz({
  initialType = "mixed",
  questions = null,
  timePerQuestion = 30,
  sounds = {
    correct: "/sounds/correct.mp3",
    wrong: "/sounds/wrong.mp3",
    click: "/sounds/click.mp3",
    applause: "/sounds/applause.mp3",
  },
  theme = "indigo",
  onComplete = null,
}) {
  // --- sample fallback bank (used only if questions prop is null/empty) ---
  const sampleQuestions = useMemo(() => {
    const mcq = [
      {
        id: "mc1",
        type: "mcq",
        q: "Which language runs in a web browser?",
        options: ["Python", "C#", "JavaScript", "Java"],
        answer: 2,
        hint: "Think DOM & front-end.",
        difficulty: "easy",
        correctFeedback: "Correct! JavaScript runs in browsers.",
        incorrectFeedback: "Incorrect. JavaScript is the right answer.",
      },
      {
        id: "mc2",
        type: "mcq",
        q: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Cascading Style Sheets",
          "Creative Style System",
          "Control Style Sheets",
        ],
        answer: 1,
        difficulty: "easy",
      },
    ];
    const tf = [
      { id: "tf1", type: "truefalse", q: "The Earth revolves around the Sun.", answer: true, difficulty: "easy" },
      { id: "tf2", type: "truefalse", q: "Sound cannot travel through solids.", answer: false, hint: "Think about vibrations in solids.", difficulty: "medium" },
    ];
    const fill = [
      { id: "f1", type: "fill", q: "The process of finding and fixing errors in software is called _____.", answer: "debugging", difficulty: "easy", correctFeedback: "Yes — that's debugging." },
      { id: "f2", type: "fill", q: "HTTP stands for HyperText Transfer _____", answer: "Protocol", difficulty: "easy" },
    ];
    return [...mcq, ...tf, ...fill];
  }, []);

  // choose quiz bank: prefer supplied questions, otherwise fallback
  const bank = questions && questions.length ? questions : sampleQuestions;

  // choose quiz list based on initialType
  const quizList = useMemo(() => {
    if (initialType === "mixed") return bank;
    return bank.filter((q) => q.type === initialType);
  }, [bank, initialType]);

  // --- state ---
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qid: { given, correct, timedOut } }
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [muted, setMuted] = useState(false);
  const [hintUsed, setHintUsed] = useState({});
  const [fiftyUsed, setFiftyUsed] = useState({});
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(timePerQuestion);
  const [bgMusicOn, setBgMusicOn] = useState(false);
  const [showXP, setShowXP] = useState(false);

  // NEW: feedback banner state
  const [showFeedback, setShowFeedback] = useState(null); // { type: 'correct'|'incorrect', text: string } | null

  // Audio refs
  const audioCorrect = useRef(null);
const audioWrong = useRef(null);
const audioClick = useRef(null);
const audioApplause = useRef(null);
const bgMusic = useRef(null);

/**
 * CREATE AUDIO OBJECTS ONCE (NO TRUNCATION)
 */
useEffect(() => {
  if (!audioCorrect.current && sounds.correct) {
    audioCorrect.current = new Audio(sounds.correct);
  }
  if (!audioWrong.current && sounds.wrong) {
    audioWrong.current = new Audio(sounds.wrong);
  }
  if (!audioClick.current && sounds.click) {
    audioClick.current = new Audio(sounds.click);
  }
  if (!audioApplause.current && sounds.applause) {
    audioApplause.current = new Audio(sounds.applause);
  }

  if (!bgMusic.current) {
    bgMusic.current = new Audio("/sounds/background_loop.mp3");
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.75;
  }

  // apply mute state immediately
  [
    audioCorrect.current,
    audioWrong.current,
    audioClick.current,
    audioApplause.current,
    bgMusic.current,
  ].forEach((a) => {
    if (a) a.muted = muted;
  });

  // cleanup only on component unmount
  return () => {
    [
      audioCorrect.current,
      audioWrong.current,
      audioClick.current,
      audioApplause.current,
      bgMusic.current,
    ].forEach((a) => {
      try {
        a?.pause();
      } catch (e) {}
    });
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

/**
 * CONTROL BACKGROUND MUSIC PLAY / PAUSE (NO RECREATE)
 */
useEffect(() => {
  if (!bgMusic.current) return;

  if (bgMusicOn) {
    bgMusic.current.play().catch(() => {});
  } else {
    bgMusic.current.pause();
  }
}, [bgMusicOn]);

/**
 * HANDLE MUTE / UNMUTE WITHOUT RESETTING AUDIO
 */
useEffect(() => {
  [
    audioCorrect.current,
    audioWrong.current,
    audioClick.current,
    audioApplause.current,
    bgMusic.current,
  ].forEach((a) => {
    if (a) a.muted = muted;
  });
}, [muted]);


  // Keep audio muted state in sync when `muted` toggles
  useEffect(() => {
    [audioCorrect.current, audioWrong.current, audioClick.current, audioApplause.current, bgMusic.current].forEach((a) => {
      if (!a) return;
      try { a.muted = muted; } catch (e) {}
    });
  }, [muted]);

  // Timer logic
  useEffect(() => {
    if (!timePerQuestion || showResult) return;
    setTimer(timePerQuestion);
    const t = setInterval(() => {
      setTimer((s) => {
        if (s <= 1) {
          clearInterval(t);
          // mark unanswered and move on
          handleAnswer(null, true); // timed out
          return timePerQuestion;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, timePerQuestion, showResult]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (showResult) return;
      const q = quizList[index];
      if (!q) return;
      if (e.key >= "1" && e.key <= "4" && q.type === "mcq") {
        const pos = parseInt(e.key, 10) - 1;
        if (q.options && q.options[pos] !== undefined) handleAnswer(pos);
      }
      if (e.key.toLowerCase() === "h") applyHint(q.id);
      if (e.key.toLowerCase() === "f") applyFifty(q.id, q);
      if (e.key.toLowerCase() === "n") nextQuestion();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, quizList, showResult, hintUsed, fiftyUsed]);

  // Helpers
  function play(ref) {
    try {
      if (ref && ref.current) {
        ref.current.currentTime = 0;
        ref.current.play().catch(() => {});
      }
    } catch (e) {
      // swallow
    }
  }

  /**
   * handleAnswer — updated to show feedback banner (showFeedback) and wait before advancing
   * given: number | boolean | string | null
   * timedOut: boolean
   */
  function handleAnswer(given, timedOut = false) {
    const q = quizList[index];
    if (!q) return;
    // Prevent answering twice
    if (answers[q.id]) return;

    let correct = false;
    if (q.type === "mcq") correct = typeof given === "number" && given === q.answer;
    else if (q.type === "truefalse") correct = given === q.answer;
    else if (q.type === "fill") correct = typeof given === "string" && given.trim().toLowerCase() === String(q.answer).trim().toLowerCase();

    setAnswers((s) => ({ ...s, [q.id]: { given, correct, timedOut } }));

    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      // show XP float
      setShowXP(true);
      setTimeout(() => setShowXP(false), 900);
      play(audioCorrect);

      // show feedback banner
      setShowFeedback({
        type: "correct",
        text: q.correctFeedback || "Correct answer!",
      });
    } else {
      setStreak(0);
      play(audioWrong);

      setShowFeedback({
        type: "incorrect",
        text: q.incorrectFeedback || "Incorrect!",
      });
    }

    // WAIT so user sees banner, then advance.
    setTimeout(() => {
      setShowFeedback(null);

      if (index + 1 < quizList.length) setIndex((i) => i + 1);
      else finish();
    }, 1200);
  }

  function finish() {
    setShowResult(true);
    play(audioApplause);
    if (onComplete) {
      try {
        onComplete({ score, total: quizList.length, details: answers });
      } catch (e) {
        // swallow
      }
    }
  }

  function nextQuestion() {
    if (index + 1 < quizList.length) setIndex((i) => i + 1);
    else finish();
  }

  function applyHint(qid) {
    setHintUsed((h) => ({ ...h, [qid]: true }));
    play(audioClick);
  }

  function applyFifty(qid, q) {
    if (fiftyUsed[qid]) return;
    if (q.type !== "mcq" || !q.options) return;
    const correctIdx = q.answer;
    const options = q.options.map((o, i) => ({ i, text: o }));
    const incorrect = options.filter((o) => o.i !== correctIdx);
    incorrect.sort(() => Math.random() - 0.5);
    const toHide = incorrect.slice(0, 2).map((o) => o.i);
    setFiftyUsed((f) => ({ ...f, [qid]: toHide }));
    play(audioClick);
  }

  function restart() {
    setIndex(0); setAnswers({}); setScore(0); setShowResult(false); setStreak(0); setHintUsed({}); setFiftyUsed({}); setShowFeedback(null);
  }

  // UI helpers
  const current = quizList[index];
  const progress = Math.round(((index) / Math.max(quizList.length, 1)) * 100);

  // Accent mapping (keeps some original class logic for nice gradient)
  const accent = {
    indigo: "indigo",
    emerald: "emerald",
    rose: "rose",
    amber: "amber",
  }[theme] || "indigo";

  // XP reward value (customizable)
  const XP_PER_CORRECT = 30;

  // Difficulty colors: accept either lowercase or capitalized input via toLowerCase
  const difficultyColor = {
    easy: "#16a34a",
    medium: "#ca8a04",
    hard: "#dc2626",
  };

  return (
    <div style={{ minHeight: 360, position: "relative" }}>
      {/* FEEDBACK BANNER (NEW) */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "10px 18px",
              borderRadius: 12,
              background:
                showFeedback.type === "correct"
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.15)",
              border:
                showFeedback.type === "correct"
                  ? "1px solid rgba(34,197,94,0.4)"
                  : "1px solid rgba(239,68,68,0.4)",
              color:
                showFeedback.type === "correct" ? "#15803d" : "#b91c1c",
              fontWeight: 600,
              zIndex: 50
            }}
          >
            {showFeedback.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gamified XP float */}
      <AnimatePresence>
        {showXP && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.9 }}
            animate={{ opacity: 1, y: -40, scale: 1.05 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute",
              left: "50%",
              top: "18%",
              transform: "translateX(-50%)",
              zIndex: 40,
              pointerEvents: "none",
              fontWeight: 800,
              color: "var(--accent)",
              background: "rgba(255,255,255,0.06)",
              padding: "6px 10px",
              borderRadius: 16,
              boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
            }}
          >
            +{XP_PER_CORRECT} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top controls / header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Quick practice</h1>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            Keyboard shortcuts: 1-4 (options), H (hint), F (50-50), N (next)
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ textAlign: "right", marginRight: 6 }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Score</div>
            <div style={{ fontWeight: 800, fontSize: 16, color: "var(--accent)" }}>{score} / {quizList.length}</div>
          </div>

          {/* Mute / Music / Restart controls */}
          <button
            type="button"
            className="module-secondary-btn"
            onClick={() => setMuted((m) => !m)}
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? "🔇" : "🔊"}
          </button>

          <button
            type="button"
            className="module-secondary-btn"
            onClick={() => {
              setBgMusicOn((b) => {
                const next = !b;
                try {
                  if (!next) {
                    bgMusic.current && bgMusic.current.pause();
                  } else {
                    bgMusic.current && bgMusic.current.play().catch(() => {});
                  }
                } catch (e) {}
                return next;
              });
            }}
          >
            {bgMusicOn ? "Music: On" : "Music: Off"}
          </button>

          <button
            type="button"
            className="module-secondary-btn"
            onClick={restart}
          >
            Restart
          </button>
        </div>
      </div>

      {/* Main card */}
      <div style={{ background: "var(--bg-elevated)", borderRadius: 14, padding: 12, border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-soft)" }}>
        {/* PROGRESS + TIMER */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Question {index + 1} / {quizList.length}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Streak: <strong>{streak}</strong></div>
            </div>
            <div style={{ marginTop: 8, height: 8, background: "rgba(15,23,42,0.06)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, var(--accent), var(--purple))", transition: "width 0.3s ease" }} />
            </div>
          </div>

          <div style={{ textAlign: "right", minWidth: 110 }}>
            {timePerQuestion ? <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Time left: <strong>{timer}s</strong></div> : <div>&nbsp;</div>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}>
          {/* QUESTION PANEL */}
          <div>
            <AnimatePresence exitBeforeEnter>
              <motion.div key={current ? current.id : "empty"} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }} style={{ padding: 12, borderRadius: 12, background: "linear-gradient(145deg, rgba(255,255,255,0.02), rgba(0,0,0,0.02))" }}>
                {current ? (
                  <>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      {/* question icon */}
                      <div style={{ width: 56, height: 56, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, var(--accent), var(--purple))", color: "#1ae5deff", fontWeight: 800, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}>
                        {index + 1}
                      </div>

                      <div>
                        <h2 style={{ margin: 0, fontSize: 18 }}>{current.q}</h2>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>{current.type.toUpperCase()} question</div>
                      </div>
                    </div>

                    {/* DIFFICULTY TAG */}
                    {current.difficulty && (
                      <div
                        style={{
                          fontSize: 12,
                          padding: "6px 10px",
                          display: "inline-block",
                          marginTop: 10,
                          borderRadius: 6,
                          background: (() => {
                            const c = difficultyColor[String(current.difficulty).toLowerCase()] || "#6b7280";
                            return c + "22";
                          })(),
                          color: (() => difficultyColor[String(current.difficulty).toLowerCase()] || "#374151")(),
                          fontWeight: 600,
                        }}
                      >
                        Difficulty: {String(current.difficulty)}
                      </div>
                    )}

                    <div style={{ marginTop: 14 }}>
                      {/* MCQ */}
                      {current.type === "mcq" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {current.options.map((opt, i) => {
                            const hiddenByFifty = fiftyUsed[current.id] && fiftyUsed[current.id].includes(i);
                            const answered = answers[current.id];
                            const isCorrect = answered && answered.correct && answered.given === i;
                            const showCorrect = answered && !answered.correct && current.answer === i;

                            return (
                              <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                disabled={!!answers[current.id] || hiddenByFifty}
                                className={`module-secondary-btn`}
                                style={{
                                  textAlign: "left",
                                  padding: "12px",
                                  borderRadius: 12,
                                  display: "flex",
                                  gap: 10,
                                  alignItems: "center",
                                  justifyContent: "flex-start",
                                  border: isCorrect ? `1px solid rgba(34,197,94,0.6)` : undefined,
                                  background: answered ? (isCorrect ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.03)") : undefined,
                                  opacity: hiddenByFifty ? 0.5 : 1,
                                  cursor: !!answers[current.id] ? "default" : "pointer",
                                }}
                              >
                                <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, background: isCorrect ? "rgba(34,197,94,0.12)" : "#fff", border: "1px solid rgba(0,0,0,0.06)" }}>
                                  {String.fromCharCode(65 + i)}
                                </div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: isCorrect ? "var(--accent)" : undefined }}>{opt}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* TRUE/FALSE */}
                      {current.type === "truefalse" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => handleAnswer(true)} disabled={!!answers[current.id]} className="module-primary-btn">True</button>
                          <button onClick={() => handleAnswer(false)} disabled={!!answers[current.id]} className="module-secondary-btn">False</button>
                        </div>
                      )}

                      {/* FILL */}
                      {current.type === "fill" && (
                        <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements["ans"].value; handleAnswer(val); e.target.reset(); }} style={{ display: "flex", gap: 8 }}>
                          <input name="ans" placeholder="Type your answer here" style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid var(--border-subtle)" }} />
                          <button type="submit" className="module-primary-btn">Submit</button>
                        </form>
                      )}

                      {/* FEEDBACK BELOW OPTIONS (keeps previous UX as well) */}
                      {answers[current?.id] && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{
                            marginTop: 14,
                            padding: 12,
                            borderRadius: 8,
                            background: answers[current.id].correct
                              ? "rgba(34,197,94,0.12)"
                              : "rgba(239,68,68,0.12)",
                            borderLeft: `4px solid ${
                              answers[current.id].correct ? "#22c55e" : "#ef4444"
                            }`,
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          {answers[current.id].correct
                            ? (current.correctFeedback || "Great job!")
                            : (current.incorrectFeedback || "Review this concept.")}
                        </motion.div>
                      )}
                    </div>

                    {/* controls row */}
                    <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => applyHint(current.id)} disabled={!!hintUsed[current.id] || !!answers[current.id]} className="module-secondary-btn">Hint (H)</button>
                        <button onClick={() => applyFifty(current.id, current)} disabled={!!fiftyUsed[current.id] || !!answers[current.id]} className="module-secondary-btn">50-50 (F)</button>
                        <button onClick={() => { setAnswers((s) => ({ ...s, [current.id]: { given: null, correct: false } })); nextQuestion(); }} className="module-secondary-btn">Skip</button>
                      </div>

                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                        Answered: {Object.keys(answers).length}
                      </div>
                    </div>

                    {/* hint area */}
                    <div style={{ marginTop: 10 }}>
                      <AnimatePresence>
                        {hintUsed[current.id] && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 10, borderRadius: 8, background: "rgba(250, 204, 21, 0.08)", borderLeft: "4px solid rgba(250, 204, 21, 0.6)", color: "#92400e" }}>
                            {current.hint || "No hint available for this question."}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: 18, textAlign: "center", color: "var(--text-muted)" }}>No questions available.</div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* SIDE PANEL */}
          <div style={{ borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.02)", minHeight: 160 }}>
            <div style={{ marginBottom: 10 }}>
              <h4 style={{ margin: 0, fontSize: 14 }}>Quick Overview</h4>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Progress, badges and actions to encourage learners.</div>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)" }}>
                <div>Progress</div>
                <div>{progress}%</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-muted)" }}>
                <div>Streak</div>
                <div>{streak}</div>
              </div>

              <div style={{ paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
                <h5 style={{ margin: "6px 0", fontSize: 13 }}>Badges</h5>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ padding: "6px 8px", borderRadius: 999, background: "rgba(99,102,241,0.08)", color: "#6d28d9", fontSize: 12 }}>Quick Learner</span>
                  <span style={{ padding: "6px 8px", borderRadius: 999, background: "rgba(16,185,129,0.06)", color: "#059669", fontSize: 12 }}>Accuracy 80%</span>
                  <span style={{ padding: "6px 8px", borderRadius: 999, background: "rgba(244,63,94,0.06)", color: "#be123c", fontSize: 12 }}>First Attempt</span>
                </div>
              </div>

              <div style={{ paddingTop: 8, borderTop: "1px solid var(--border-subtle)" }}>
                <h5 style={{ margin: "6px 0", fontSize: 13 }}>Actions</h5>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => { /* export placeholder */ alert("Export not implemented"); }} className="module-secondary-btn">Export results</button>
                  <button onClick={() => { /* challenge placeholder */ alert("Challenge a peer not implemented"); }} className="module-secondary-btn">Challenge a peer</button>
                </div>
              </div>
            </div>
          </div>
        </div> {/* end grid */}
      </div> {/* end main card */}

      {/* Footer controls */}
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Tip: Use keyboard shortcuts for speed & accessibility.</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setIndex(0); setShowResult(false); }} className="module-secondary-btn">Review</button>
          <button onClick={finish} className="module-primary-btn">Finish</button>
        </div>
      </div>

      {/* Results modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
            <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} exit={{ scale: 0.98 }} style={{ width: "min(900px,96%)", background: "var(--bg-elevated)", borderRadius: 12, padding: 18, border: "1px solid var(--border-subtle)" }}>
              <h2 style={{ margin: 0 }}>Results</h2>
              <p style={{ color: "var(--text-muted)", marginTop: 8 }}>You scored <strong style={{ color: "var(--accent)" }}>{score}</strong> out of {quizList.length}.</p>

              <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                {quizList.map((q, i) => {
                  const ans = answers[q.id];
                  const displayGiven = ans?.given === null ? "—" : (q.type === "mcq" ? (typeof ans?.given === "number" ? q.options?.[ans.given] ?? ans.given : ans.given) : String(ans?.given ?? "—"));
                  return (
                    <div key={q.id} style={{ padding: 10, borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{i + 1}. {q.q}</div>
                      <div style={{ marginTop: 6, fontSize: 13, color: ans?.correct ? "#059669" : "#dc2626" }}>
                        Your answer: {displayGiven}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => { setShowResult(false); }} className="module-secondary-btn">Close</button>
                <button onClick={restart} className="module-primary-btn">Try Again</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
