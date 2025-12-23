import "./modules.css";

export default function ModulesPage({ modules, onSelectModule }) {
  if (!modules || modules.length === 0) {
    return <div className="modules-loading">Loading courses…</div>;
  }

  return (
    <div className="modules-page">
      {/* HEADER */}
      <div className="modules-header">
        <h1>All Courses</h1>
        <p>Explore all learning modules available to you</p>
      </div>

      {/* GRID */}
      <div className="modules-grid">
        {modules.map((module) => (
          <div
            key={module.id}
            className="module-card"
            onClick={() => onSelectModule(module)}
          >
            <div className="module-image">
              {module.image && (
                <img src={module.image} alt={module.title} />
              )}
            </div>

            <div className="module-content">
              <span className="module-level">{module.level}</span>
              <h3>{module.title}</h3>
              <p>{module.desc || "Start learning this module"}</p>

              <div className="module-meta">
                <span>{module.topics.length} Topics</span>
                <span className="arrow">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
