import "../styles/hero.css";

export default function Hero() {
  return (
    <section id="home" className="hero">
      {/* BACKGROUND */}
      <div className="hero-bg" />

      <div className="hero-inner">
        {/* LEFT CONTENT */}
        <div>
          <h1 className="hero-title">
            Your Journey Into <span className="ai">AI</span>
            <br />
            Starts <span className="college">Early</span>
            <br />
            Starts <span className="ai">Here</span>
          </h1>

          <span className="hero-curve" />

          <p className="hero-subtext">
            Beginner-friendly AI courses designed for school students —
            learn concepts, practice with activities, and get future-ready.
          </p>

          <div className="hero-actions">
            <button className="hero-btn">
              Enroll Now <span className="arrow">→</span>
            </button>
          </div>

          {/* FLOATING ICONS */}
          <img src="/hero/Ai.png" className="icon Ai" alt="" />
          <img src="/hero/robot.png" className="icon robot" alt="" />
          <img src="/hero/like.png" className="icon like" alt="" />
        </div>

        {/* RIGHT VISUAL */}
        <div className="hero-image">
          <div className="hero-image-circle">
            <img
              src="/hero/main.png"
              alt="student learning AI"
              className="hero-main-image"
            />
          </div>

      
        </div>
      </div>

      {/* WAVE */}
      <img src="/hero/wave.png" className="hero-wave" alt="wave" />
    </section>
  );
}
