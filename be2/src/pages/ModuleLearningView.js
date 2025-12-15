import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ProfessionalQuiz from "./ProfessionalQuiz"; // ensure this file is in the same folder

/**
 * ModuleLearningView (portal modal + quick-practice integration)
 *
 * Props:
 *  - module
 *  - progress
 *  - onCompleteTopic(moduleId, topicIndex)
 *  - onBack()
 *  - onOpenActivity(topicIndex)
 *
 * This component renders the module learning UI and opens the quiz inside a portal modal
 * whenever Quick practice is clicked. The portal avoids z-index/stacking issues.
 */
function ModuleLearningView({
  module,
  progress = {},
  onCompleteTopic,
  onBack,
  onOpenActivity,
}) {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizInitialType, setQuizInitialType] = useState("mixed");

  const topics = module?.topics || [];
  const moduleProgress = progress?.[module?.id] || {};
  const isTopicDone = (i) => !!moduleProgress[i];

  // Derived fallback questions used if module.quiz[topicIndex] is missing
  function makeDerivedQuestions(topicText, moduleId, idx) {
    return [
      {
        id: `${moduleId || "m"}-${idx}-q1`,
        type: "mcq",
        q: `Which statement about "${topicText}" is most correct?`,
        options: [
          "It never needs data",
          "It uses data to learn",
          "It runs without examples",
          "It is fully random",
        ],
        answer: 1,
        hint: "Think: learning requires examples.",
      },
      {
        id: `${moduleId || "m"}-${idx}-q2`,
        type: "truefalse",
        q: `${topicText} often requires cleaning input data.`,
        answer: true,
        hint: "Raw data is usually noisy.",
      },
    ];
  }

  const topic = topics[activeTopicIndex];

  // prefer module.topicContents (mapper output). some sheets used 'topicDescriptions' — accept either.
  const topicDescription =
    (module &&
      (module.topicContents?.[activeTopicIndex] ||
        module.topicDescriptions?.[activeTopicIndex])) ||
    "";

  const questionsForTopic =
    module?.quiz &&
    Array.isArray(module.quiz[activeTopicIndex]) &&
    module.quiz[activeTopicIndex].length
      ? module.quiz[activeTopicIndex]
      : makeDerivedQuestions(topic || `Topic ${activeTopicIndex + 1}`, module?.id, activeTopicIndex);

  // keyboard: ESC closes modal
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && quizOpen) setQuizOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quizOpen]);

  // callback when quiz completes
  function handleQuizComplete(result) {
    // result: { score, total, details }
    console.log("Quick practice result:", result);
    // optional: auto-mark completed if accuracy threshold met
    if (result && typeof result.score === "number" && result.total) {
      const accuracy = result.score / Math.max(result.total, 1);
      if (accuracy >= 0.6) {
        try {
          onCompleteTopic && onCompleteTopic(module.id, activeTopicIndex);
        } catch (e) {
          // swallow errors to not break modal close
          console.warn("onCompleteTopic error:", e);
        }
      }
    }
    // close the quiz modal after completion
    setQuizOpen(false);
  }

  // Modal portal implementation (renders children into document.body)
  function Modal({ children, onClose }) {
    const elId = "mlv-quiz-modal-root";
    let root = document.getElementById(elId);
    if (!root) {
      root = document.createElement("div");
      root.id = elId;
      document.body.appendChild(root);
    }

    return ReactDOM.createPortal(
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.45)",
          padding: 12,
        }}
        onMouseDown={(e) => {
          // close when backdrop clicked
          if (e.target === e.currentTarget) {
            onClose && onClose();
          }
        }}
      >
        <div
          style={{
            width: "min(1100px, 98%)",
            maxHeight: "92vh",
            overflow: "auto",
            borderRadius: 12,
            background: "var(--bg-elevated)",
            boxShadow: "var(--shadow-soft)",
            padding: 12,
            border: "1px solid var(--border-subtle)",
          }}
        >
          {children}
        </div>
      </div>,
      root
    );
  }

  return (
    <section className="module-learning" aria-labelledby="module-learning-title">
      {/* LEFT: topic list */}
      <aside className="module-learning-sidebar" aria-label="Topics list">
        <div className="module-learning-header">
          <h2 id="module-learning-title">{module?.title}</h2>
          {/* keep short guidance but do not show filler topic content here */}
          <p className="module-learning-sub">
            Choose a sub-topic on the left and use the activity workspace to explore it with videos, quizzes, or mini-games.
          </p>
        </div>

        <ul className="learning-topic-list">
          {topics.map((topicText, i) => (
            <li
              key={`${topicText}-${i}`}
              className={`learning-topic-item ${activeTopicIndex === i ? "active" : ""} ${
                isTopicDone(i) ? "done" : ""
              }`}
              onClick={() => setActiveTopicIndex(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActiveTopicIndex(i);
              }}
            >
              <div className="learning-topic-main">
                <span className="learning-topic-badge">{i + 1}</span>
                <div>
                  <p className="learning-topic-title">{topicText}</p>
                  <p className="learning-topic-caption">{isTopicDone(i) ? "Completed" : "Tap to learn"}</p>
                </div>
              </div>

              {isTopicDone(i) && <span className="learning-topic-check">✔</span>}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="module-secondary-btn full-width"
          onClick={onBack}
          style={{ marginTop: 10 }}
        >
          ← Back to modules
        </button>
      </aside>

      {/* CENTER: explanation + actions */}
      <div className="module-learning-content" aria-live="polite">
        <div className="learning-content-header">
          <h3>{topics[activeTopicIndex]}</h3>
          <span className="learning-content-pill">Topic overview</span>
        </div>

        <div className="learning-content-body">
          <div className="learning-content-main-card" style={{ position: "relative" }}>
            {/* Render sheet-provided topic content (HTML allowed) — show nothing if not provided */}
            {topicDescription ? (
              <div
                className="learning-content-text"
                dangerouslySetInnerHTML={{ __html: topicDescription }}
              />
            ) : null}
          </div>

          <div className="learning-content-actions" style={{ alignItems: "center" }}>
            {/* Quick practice opens the quiz modal via portal */}
            <button
              type="button"
              className="module-secondary-btn"
              onClick={() => {
                setQuizInitialType("mixed");
                setQuizOpen(true);
              }}
            >
              Quick practice
            </button>

            {/* ⭐ REQUIRED: start full activity workspace for selected topic */}
            <button
              type="button"
              className="module-primary-btn"
              onClick={() => onOpenActivity(activeTopicIndex)}
            >
              Start activity workspace
            </button>

            <button
                type="button"
                className="module-primary-btn"
                onClick={() => {
                    window.location.href = `/explain?moduleId=${module.id}&topic=${activeTopicIndex}`;
                }}
                >
                Explain
            </button>

            <button
              type="button"
              className="module-primary-btn"
              onClick={() => onCompleteTopic(module.id, activeTopicIndex)}
            >
              Mark as completed
            </button>
          </div>
        </div>
      </div>

      {/* QUIZ MODAL (portal) */}
      {quizOpen && (
        <Modal onClose={() => setQuizOpen(false)}>
          {/* header of modal */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 14, color: "var(--text-muted)" }}>
                {module?.title} • {topics[activeTopicIndex]}
              </div>
              <h3 style={{ margin: "4px 0 0 0" }}>Quick practice</h3>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                className="module-secondary-btn"
                onClick={() => setQuizOpen(false)}
              >
                Close
              </button>
            </div>
          </div>

          <div>
            <ProfessionalQuiz
              initialType={quizInitialType}
              questions={questionsForTopic}
              timePerQuestion={20}
              onComplete={handleQuizComplete}
            />
          </div>
        </Modal>
      )}
    </section>
  );
}

export default ModuleLearningView;
