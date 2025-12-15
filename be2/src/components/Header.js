import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function Header({ isDarkMode, onToggleTheme }) {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
    user,
  } = useAuth0();

  // Avoid flicker while Auth0 loads
  if (isLoading) {
    return (
      <header className="app-header">
        <div className="logo-wrap">
          <img src="/logo.png" alt="Book Einstein logo" className="logo-img" />
        </div>
      </header>
    );
  }

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
        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle light/dark mode"
        >
          <span className="theme-icon">{isDarkMode ? "🌙" : "☀️"}</span>
        </button>

        {/* AUTH BUTTONS */}
        {isAuthenticated ? (
          <>
            {/* Optional: user avatar */}
            {user?.picture && (
              <img
                src={user.picture}
                alt={user.name}
                title={user.name}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
            )}

            <button
              className="auth-btn outline"
              onClick={() =>
                logout({
                  logoutParams: { returnTo: window.location.origin },
                })
              }
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <button
              className="auth-btn outline"
              onClick={() => loginWithRedirect()}
            >
              Sign in
            </button>

            <button
              className="auth-btn primary"
              onClick={() => loginWithRedirect()}
            >
              Get started
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
