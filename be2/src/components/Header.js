import React from "react";

function Header({ isSignedIn, isDarkMode, onToggleTheme, onToggleAuth }) {
  return (
    <header className="app-header">
      <div className="logo-wrap">
        <img src="/logo.png" alt="Book Einstein logo" className="logo-img" />
      </div>

      <nav className="nav-links">
        <button className="nav-link-btn">Teachers</button>
        <button className="nav-link-btn">About</button>
        <button className="nav-link-btn">Pricing</button>
        <button className="nav-link-btn">Community</button>
      </nav>

      <div className="header-actions">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle light/dark mode"
        >
          <span className="theme-icon">{isDarkMode ? "🌙" : "☀️"}</span>
        </button>
        <button className="auth-btn outline" onClick={onToggleAuth}>
          {isSignedIn ? "Sign out" : "Sign in"}
        </button>
        {!isSignedIn && (
          <button className="auth-btn primary" onClick={onToggleAuth}>
            Get started
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
