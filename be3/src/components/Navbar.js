import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../styles/navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <img src="/navbar/logo.png" alt="Book Einstein" className="logo" />

        {/* Desktop Nav */}
        <nav className="nav-links">
          <a className="active">Home</a>
          <a>Courses</a>
          <a>Activities</a>
          <a>About Us</a>
          <a>Contact</a>
        </nav>

        {/* Desktop Right */}
        <div className="nav-right">
          <div className="search-box">
            <span>Categories</span>
            <button>Search</button>
          </div>

          {!isLoading && !isAuthenticated && (
            <div className="auth-buttons">
              <button
                className="auth-btn outline"
                onClick={() => loginWithRedirect()}
              >
                Sign In
              </button>

              <button
                className="auth-btn primary"
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: "signup" },
                  })
                }
              >
                Register
              </button>
            </div>
          )}

          {!isLoading && isAuthenticated && (
            <button
              className="auth-btn outline"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="mobile-menu">
          <a>Home</a>
          <a>Courses</a>
          <a>Activities</a>
          <a>About Us</a>
          <a>Contact</a>

          <div className="mobile-search">
            <input placeholder="Search courses..." />
            <button>Search</button>
          </div>

          {!isAuthenticated ? (
            <>
              <button
                className="mobile-signin"
                onClick={() => loginWithRedirect()}
              >
                Sign In
              </button>
              <button
                className="mobile-register"
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: "signup" },
                  })
                }
              >
                Register
              </button>
            </>
          ) : (
            <button
              className="mobile-signin"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
