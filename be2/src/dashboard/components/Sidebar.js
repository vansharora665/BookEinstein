import { useState } from "react";
import "./sidebar.css";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Top toggle */}
      <div className="sidebar-logo">
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title="Toggle sidebar"
        >
          🎓
        </button>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-title">MAIN MENU</p>

        <nav className="sidebar-nav">
          <a className="active">🏠 {!collapsed && "Dashboard"}</a>
          <a>📘 {!collapsed && "My Courses"}</a>
          <a>🔍 {!collapsed && "Browse Courses"}</a>
          <a>📝 {!collapsed && "Quizzes & Scores"}</a>
          <a>🏆 {!collapsed && "Achievements"}</a>
          <a>📊 {!collapsed && "Leaderboard"}</a>
          <a>⚡ {!collapsed && "Activities"}</a>
        </nav>
      </div>

      <div className="sidebar-section bottom">
        <p className="sidebar-title">SETTING</p>
        <nav className="sidebar-nav">
          <a>⚙️ {!collapsed && "Settings"}</a>
          <a>❓ {!collapsed && "Help Center"}</a>
        </nav>
      </div>
    </aside>
  );
}
