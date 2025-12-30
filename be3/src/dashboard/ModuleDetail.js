import "./learning.css";

export default function ModuleDetail({
  module,
  topicProgress = {},
  onBack,
  onOpenTopic,
}) {
  if (!module) return null;

  return (
    <div className="module-detail">
      <button className="back-btn" onClick={onBack}>
        ← Back to Modules
      </button>

      {/* MODULE HEADER */}
      <div className="module-header">
        {module.image && (
          <img
            src={module.image}
            alt={module.title}
            className="module-cover"
          />
        )}
        <div>
          <h1>{module.title}</h1>
          <p>{module.desc}</p>
        </div>
      </div>

      {/* TOPICS LIST */}
      <div className="topics-list">
        {module.topics.map((topic, i) => {
          const progress = topicProgress[i] || 0;

          // 🔒 LOCK LOGIC
          const isLocked =
            i > 0 && (topicProgress[i - 1] || 0) < 100;

          return (
            <div
              key={i}
              className={`topic-card topic-color-${i % 6} ${
                isLocked ? "locked" : ""
              }`}
              onClick={() => {
                if (!isLocked) onOpenTopic(i);
              }}
            >
              {/* LEFT: Topic image or fallback */}
              <div
                className="topic-thumb"
                style={{
                  backgroundImage: module.topicImages?.[i]
                    ? `url(${module.topicImages[i]})`
                    : "none",
                }}
              >
                {!module.topicImages?.[i] && (
                  <span className="topic-fallback" />
                )}

                {/* 🔒 LOCK ICON */}
                {isLocked && (
                  <div className="topic-lock">🔒</div>
                )}
              </div>

              {/* CENTER: Text */}
              <div className="topic-text">
                <h3>{topic}</h3>
                <p>
                  {module.topicContents?.[i]?.slice(0, 90) ||
                    "Start this topic"}
                </p>

                {/* ✅ PROGRESS BAR */}
                <div className="topic-progress">
                  <div className="topic-progress-bar">
                    <div
                      className="topic-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span>{progress}%</span>
                </div>
              </div>

              {/* RIGHT: ACTION */}
              <span className="topic-action">
                {isLocked ? "Locked" : progress === 100 ? "Completed ✓" : "Start →"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
