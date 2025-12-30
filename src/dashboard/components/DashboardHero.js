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
              Hello, <span>{firstName}</span>
            </h1>
            <p>Welcome back</p>
          </div>
        </div>

        {/* ACTION BUTTONS (UNCHANGED) */}
        <div className="hero-actions">
          <button className="hero-btn primary">
            Resume Course
          </button>

          <button className="hero-btn outline">
            Explore Courses
          </button>
        </div>
      </div>

      {/* RIGHT ICON FIELD (UNCHANGED) */}
      <div className="hero-right">
        {[...Array(8)].map((_, i) => (
          <img
            key={i}
            src={`/dashboard/${i}.png`}
            alt={`decor-${i}`}
            className={`hero-icon f${i}`}
          />
        ))}
      </div>
    </section>
  );
}
