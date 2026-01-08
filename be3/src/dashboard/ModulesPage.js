import "./modules.css";
import Loader from "../common/Loader";

export default function ModulesPage({ modules, onSelectModule }) {
  if (modules === null) return <Loader text="Loading courses..." />;

  if (!Array.isArray(modules)) {
    return <div className="error-state">Something went wrong loading courses.</div>;
  }

  return (
    <div className="modules-page">
      <header className="modules-header">
        <div className="header-text">
          <h1>Learning Path</h1>
          <p>Master AI step-by-step with our curated modules</p>
        </div>
        <div className="module-stats-pill">
          {modules.length} Modules Available
        </div>
      </header>

      <div className="modules-grid">
        {modules.map((module, index) => {
          const isLocked = index >= 2; // Logic for locking

          return (
            <div
              key={module.id}
              className={`module-card ${isLocked ? "locked" : "active-card"}`}
              onClick={() => !isLocked && onSelectModule(module)}
            >
              <div className="module-image-container">
                <img src={module.image} alt={module.title} className="module-img" />
                
                {/* Status Badge */}
                <div className={`status-badge ${isLocked ? "badge-locked" : "badge-open"}`}>
                  {isLocked ? "🔒 Locked" : "🔓 Available"}
                </div>

                {isLocked && (
                  <div className="lock-glass-overlay">
                    <div className="lock-circle">
                      <span className="lock-emoji">🔒</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="module-content">
                <div className="module-top-row">
                  <span className="module-tag">{module.level || "Beginner"}</span>
                  <span className="module-topics-count">{module.topics.length} Topics</span>
                </div>
                
                <h3>{module.title}</h3>
                <p className="module-description">
                  {module.desc || "Explore the fundamentals of this module and build your core skills."}
                </p>

                <div className="module-footer">
                   <button className="start-btn">
                     {isLocked ? "Unlock Module" : "Start Learning"}
                     <span className="btn-arrow">→</span>
                   </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}