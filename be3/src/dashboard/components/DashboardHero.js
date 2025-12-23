import "./dashboardHero.css";

export default function DashboardHero() {
  return (
    <section className="dashboard-hero">
      {/* LEFT CONTENT */}
      <div className="hero-left">
        <h1>
          Ready to keep <br />
          learning today?
        </h1>

        <p>
          Continue your learning journey and achieve your goals with
          structured modules and engaging activities.
        </p>

        <div className="hero-actions">
          <button
            className="hero-btn primary"
          >
            Resume Course
          </button>

          <button
            className="hero-btn outline"
          >
            Explore Courses
          </button>
        </div>
      </div>

      {/* RIGHT ICON FIELD */}
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
