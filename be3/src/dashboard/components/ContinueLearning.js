import "./continueLearning.css";

export default function ContinueLearning({ module, onSeeAll }) {
  if (!module) return null;

  const totalTopics = module.topics.length;
  const completedTopics = 0; // later from localStorage

  const progress =
    totalTopics === 0
      ? 0
      : Math.round((completedTopics / totalTopics) * 100);

  return (
    <section className="continue-learning">

        <div className="cl-top">
  <span className="cl-badge">Continue Learning</span>

  <button
    className="cl-seeall"
    onClick={onSeeAll}
    aria-label="See all courses"
  >
    See all
  </button>
</div>

      {/* LEFT IMAGE */}
      <div className="cl-image">
        {module.image && (
          <img src={module.image} alt={module.title} />
        )}
      </div>

      {/* MIDDLE CONTENT */}
      <div className="cl-content">

        <h3>{module.title}</h3>

        <p>
          Next Module:{" "}
          <strong>{module.topics[0] || "Getting Started"}</strong>
        </p>
      </div>

      {/* RIGHT BUTTON */}
      <div className="cl-action">
        <button className="cl-btn">
          Resume Course
        </button>
      </div>

      {/* PROGRESS (BOTTOM FULL WIDTH) */}
      <div className="cl-progress">
        <div className="progress-label">
          <span>
            {completedTopics}/{totalTopics} Topics
          </span>
          <span>{progress}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
