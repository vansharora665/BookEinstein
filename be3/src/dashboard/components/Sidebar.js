import { useState } from "react";
import "./sidebar.css";

export default function Sidebar({ navigateTo }) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");

  const handleClick = (view) => {
    setActive(view);
    navigateTo(view); // ✅ CENTRAL NAVIGATION
  };

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
        {!collapsed && <p className="sidebar-title">MAIN MENU</p>}

        <nav className="sidebar-nav">
          <a
            className={active === "dashboard" ? "active" : ""}
            onClick={() => handleClick("dashboard")}
          >
            <span className="sidebar-icon">🏠</span>
            <span className="sidebar-text">Dashboard</span>
          </a>

          <a
            className={active === "modules" ? "active" : ""}
            onClick={() => handleClick("modules")}
          >
            <span className="sidebar-icon">📘</span>
            <span className="sidebar-text">Courses</span>
          </a>

          <a
            className={active === "browse" ? "active" : ""}
            onClick={() => handleClick("browse")}
          >
            <span className="sidebar-icon">🔍</span>
            <span className="sidebar-text">Browse Courses</span>
          </a>

          <a
            className={active === "quizzes" ? "active" : ""}
            onClick={() => handleClick("quizzes")}
          >
            <span className="sidebar-icon">📝</span>
            <span className="sidebar-text">Quizzes & Scores</span>
          </a>

          <a
            className={active === "achievements" ? "active" : ""}
            onClick={() => handleClick("achievements")}
          >
            <span className="sidebar-icon">🏆</span>
            <span className="sidebar-text">Achievements</span>
          </a>

          <a
            className={active === "leaderboard" ? "active" : ""}
            onClick={() => handleClick("leaderboard")}
          >
            <span className="sidebar-icon">📊</span>
            <span className="sidebar-text">Leaderboard</span>
          </a>

          <a
            className={active === "activities" ? "active" : ""}
            onClick={() => handleClick("activities")}
          >
            <span className="sidebar-icon">⚡</span>
            <span className="sidebar-text">Activities</span>
          </a>
        </nav>
      </div>

      <div className="sidebar-section bottom">
        {!collapsed && <p className="sidebar-title">SETTINGS</p>}

        <nav className="sidebar-nav">
          <a
            className={active === "settings" ? "active" : ""}
            onClick={() => handleClick("settings")}
          >
            <span className="sidebar-icon">⚙️</span>
            <span className="sidebar-text">Settings</span>
          </a>

          <a
            className={active === "help" ? "active" : ""}
            onClick={() => handleClick("help")}
          >
            <span className="sidebar-icon">❓</span>
            <span className="sidebar-text">Help</span>
          </a>
        </nav>
      </div>
    </aside>
  );
}
