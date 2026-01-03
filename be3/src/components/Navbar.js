import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";


export default function Navbar() {
  const [open, setOpen] = useState(false);
const isActive = (path) => {
  if (path === "/") {
    return location.pathname === "/";
  }
  return location.pathname.startsWith(path);
};

  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    isLoading,
    user,
  } = useAuth0();

  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  useEffect(() => {
  if (location.pathname !== "/") {
    setActiveSection(null);
  }
}, [location.pathname]);

const isRoute = (path) => location.pathname === path;

  const isHome = location.pathname === "/";

  useEffect(() => {
  if (location.pathname !== "/") return;

  const sections = ["home", "courses", "about", "contact"];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-40% 0px -50% 0px",
      threshold: 0,
    }
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, [location.pathname]);


  /* --------------------------------------------------
     SMART NAVIGATION (scroll on home, route elsewhere)
  -------------------------------------------------- */
  const goTo = (id) => {
    setOpen(false);

    // If already on home → scroll
    if (isHome) {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Else → navigate to home first, then scroll
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* LOGO */}
        <img
          src="/navbar/logo.png"
          alt="Book Einstein"
          className="logo"
          onClick={() => navigate("/")}
        />

        {/* DESKTOP NAV */}
       <nav className="nav-links">

        <a
    className={isRoute("/dashboard") ? "active" : ""}
    onClick={() => navigate("/dashboard")}
  >
    Dashboard
  </a>
  <a
    className={activeSection === "home" && location.pathname === "/" ? "active" : ""}
    onClick={() => navigate("/")}
  >
    Home
  </a>

  

      <a
    className={activeSection === "about" ? "active" : ""}
    onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
  >
    About Us
  </a>

  <a
    className={activeSection === "courses" ? "active" : ""}
    onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
  >
    Courses
  </a>



  <a
    className={activeSection === "contact" ? "active" : ""}
    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
  >
    Contact
  </a>
</nav>



        {/* RIGHT SIDE */}
        <div className="nav-right">
          {!isLoading && isAuthenticated && user && (
            <div className="user-info">
              <img src={user.picture} alt={user.name} />
              <span>{user.given_name || user.name}</span>
            </div>
          )}

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
                logout({
                  logoutParams: {
                    returnTo: window.location.origin,
                  },
                })
              }
            >
              Logout
            </button>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="mobile-menu">
          <a
  className={isActive("/") ? "active" : ""}
  onClick={() => navigate("/")}
>
  Home
</a>
          <a
  className={isActive("/dashboard") ? "active" : ""}
  onClick={() => navigate("/dashboard")}
>
  Dashboard
</a>
         {/* <a className={activeSection === "courses" ? "active" : ""} onClick={() => scrollIntoView("courses")}>
  Courses
</a>
<a className={activeSection === "about" ? "active" : ""} onClick={() => scrollIntoView("about")}>
  About Us
</a>
<a className={activeSection === "contact" ? "active" : ""} onClick={() => scrollIntoView("contact")}>
  Contact
</a> */}


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
                logout({
                  logoutParams: {
                    returnTo: window.location.origin,
                  },
                })
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
