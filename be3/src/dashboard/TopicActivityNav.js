import "./learning.css";

export default function TopicActivityNav({
  activities,
  activeIndex,
  onSelect,
  collapsed,
  setCollapsed,
  hidden,
}) {
  if (hidden) return null;

  return (
    <aside
      className={`topic-activity-nav ${collapsed ? "collapsed" : ""}`}
    >
      {/* HEADER */}
      <div className="activity-nav-header">
        {!collapsed && <span>Activities</span>}
        <button
  className="collapse-btn"
  onClick={() => setCollapsed(!collapsed)}
  aria-label="Toggle sidebar"
>
  ☰
</button>

      </div>

      {/* LIST */}
      <ul className="activity-nav-list">
        {activities.map((a, i) => (
          <li
  key={a.id}
  className={i === activeIndex ? "active" : ""}
  onClick={() => onSelect(i)}
>
  <span className="activity-icon">
    {a.type === "video" && "🎥     "}
    {a.type === "image" && "🖼️     "}
    {a.type === "quiz" && "❓      "}
    {a.type === "game" && "🎮      "}
    {!["video","image","quiz","game"].includes(a.type) && "📄"}
  </span>

  <span className="activity-title">{a.title}</span>
</li>

        ))}
      </ul>
    </aside>
  );
}
