import "./dashboardHero.css";
import "./Profile"

export default function DashboardHero() {
  // 🔑 Fetch saved profile data (fallback safe)
  const firstName =
    localStorage.getItem("profile_first_name") || "Student";

  const avatar =
    localStorage.getItem("profile_avatar") || "/avatars/ai-1.png";

  return (
    <section className="dashboard-hero">
      {/* LEFT CONTENT */}
      <div className="hero-left">
        <div className="hero-greeting">
          <img
            src={avatar}
            alt="User Avatar"
            className="hero-avatar"
          />

          <div className="hero-text">
            <h1>
              Hello   , <span>{firstName}</span>
            </h1>
            <p>Welcome back</p>
          </div>
        </div>

        {/* ACTION BUTTONS (UNCHANGED) */}
        {/* <div className="hero-actions">
          <button className="hero-btn primary">
            Resume Course
          </button>

          <button className="hero-btn outline">
            Explore Courses
          </button>
        </div> */}
      </div>

      {/* RIGHT ICON FIELD (UNCHANGED) */}
      <div className="hero-right">
  <span className="micro-pulse teal p1" />
  <span className="micro-pulse orange p2" />
  <span className="micro-pulse blue p3" />
  <span className="micro-pulse mint p4" />
  <span className="micro-pulse teal p5" />
  <span className="micro-pulse orange p6" />
  <span className="micro-pulse blue p7" />
  <span className="micro-pulse mint p8" />
  <span className="micro-pulse teal p9" />
  <span className="micro-pulse orange p10" />
</div>

    </section>
  );
}
