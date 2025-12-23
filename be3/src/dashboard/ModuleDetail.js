import "./learning.css";

export default function ModuleDetail({
  module,
  onBack,
  onOpenTopic,
}) {
  if (!module) return null;

  return (
    <div className="module-detail">
      <button className="back-btn" onClick={onBack}>
        ← Back to Modules
      </button>

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

      <div className="topics-list">
        {module.topics.map((topic, i) => (
          <div
            key={i}
            className="topic-card"
            onClick={() => onOpenTopic(i)}
          >
            <div className="topic-text">
              <h3>{topic}</h3>
              <p>
                {module.topicContents[i]?.slice(0, 90) ||
                  "Start this topic"}
              </p>
            </div>

            <span className="topic-action">Start →</span>
          </div>
        ))}
      </div>
    </div>
  );
}
