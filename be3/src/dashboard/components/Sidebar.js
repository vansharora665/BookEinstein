import { useState } from "react";
import "./sidebar.css";

export default function Sidebar({ navigateTo, activeView }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = (view) => {
    navigateTo(view); // ✅ SINGLE SOURCE OF NAVIGATION
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
          <SidebarItem
            icon="👤"
            label="Profile"
            active={activeView === "profile"}
            collapsed={collapsed}
            onClick={() => handleClick("profile")}
          />

          <SidebarItem
            icon="🏠"
            label="Dashboard"
            active={activeView === "dashboard"}
            collapsed={collapsed}
            onClick={() => handleClick("dashboard")}
          />

          <SidebarItem
            icon="📘"
            label="Courses"
            active={activeView === "modules"}
            collapsed={collapsed}
            onClick={() => handleClick("modules")}
          />

  

          <SidebarItem
            icon="🏆"
            label="Achievements"
            active={activeView === "achievements"}
            collapsed={collapsed}
            onClick={() => handleClick("achievements")}
          />

          
        </nav>
      </div>

    
    </aside>
  );
}

/* ===============================
   REUSABLE ITEM (ANIMATED)
================================ */

function SidebarItem({ icon, label, active, collapsed, onClick }) {
  return (
    <a
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="sidebar-icon">{icon}</span>

      <span
        className={`sidebar-text ${collapsed ? "hidden" : ""}`}
      >
        {label}
      </span>

      {/* Active indicator */}
      <span className="active-indicator" />
    </a>
  );
}
