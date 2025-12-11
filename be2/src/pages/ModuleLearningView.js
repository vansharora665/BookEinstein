import React, { useState } from "react";

function ModuleLearningView({
  module,
  progress,
  onCompleteTopic,
  onBack,
  onOpenActivity,
}) {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const topics = module.topics;
  const moduleProgress = progress[module.id] || [];
  const isTopicDone = (i) => !!moduleProgress[i];

  return (
    <section className="module-learning">
      {/* LEFT: topic list */}
      <aside className="module-learning-sidebar">
        <div className="module-learning-header">
          <h2>{module.title}</h2>
          <p className="module-learning-sub">
            Choose a sub-topic on the left and use the activity workspace to
            explore it with videos, quizzes, or mini-games.
          </p>
        </div>
        <ul className="learning-topic-list">
          {topics.map((topic, i) => (
            <li
              key={topic}
              className={`learning-topic-item ${
                activeTopicIndex === i ? "active" : ""
              } ${isTopicDone(i) ? "done" : ""}`}
              onClick={() => setActiveTopicIndex(i)}
            >
              <div className="learning-topic-main">
                <span className="learning-topic-badge">{i + 1}</span>
                <div>
                  <p className="learning-topic-title">{topic}</p>
                  <p className="learning-topic-caption">
                    {isTopicDone(i) ? "Completed" : "Tap to learn"}
                  </p>
                </div>
              </div>
              {isTopicDone(i) && (
                <span className="learning-topic-check">✔</span>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="module-secondary-btn full-width"
          onClick={onBack}
        >
          ← Back to modules
        </button>
      </aside>

      {/* CENTER: explanation + actions */}
      <div className="module-learning-content">
        <div className="learning-content-header">
          <h3>{topics[activeTopicIndex]}</h3>
          <span className="learning-content-pill">Topic overview</span>
        </div>

        <div className="learning-content-body">
          <div className="learning-content-main-card">
            <p className="learning-content-text">
              Short classroom-style explanation of this concept with simple
              language and examples from everyday life.
            </p>
            <ul className="learning-content-list">
              <li>Key idea of the topic in 3–4 sentences.</li>
              <li>
                A real-world example (for example, AI recommending songs you
                might like).
              </li>
              <li>
                A small thinking question before you start the interactive
                activity.
              </li>
            </ul>
          </div>

          <div className="learning-content-actions">
            <button
              type="button"
              className="module-secondary-btn"
              onClick={() =>
                alert(
                  "Here you could plug in a small practice question or quiz widget."
                )
              }
            >
              Quick practice
            </button>
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
              onClick={() => onCompleteTopic(module.id, activeTopicIndex)}
            >
              Mark as completed
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ModuleLearningView;
