import "../styles/hero.css";

export default function Hero() {
  return (
    <section id="home" className="hero">
      {/* BACKGROUND TEXTURE */}
      <div className="hero-bg" />

      <div className="hero-inner">
        {/* LEFT */}
        <div className="hero-text">
          <img
            src="/hero/shape.png"
            className="hero-shape"
            alt="decor"
          />

          <h1 className="hero-title">
  Your Journey Into <span className="ai">AI</span> <br />
  Starts <span className="college">Early</span> <br />
  Starts <span className="ai">Here</span>
</h1>



          <span className="hero-curve"></span>

          <p className="hero-subtext">
  Beginner-friendly AI courses designed for school students —
  learn concepts, practice with activities, and get future-ready.
</p>


          {/* ONLY ENROLL BUTTON */}
          <div className="hero-actions">
            <button className="hero-btn">
              Enroll Now
              <span className="arrow">→</span>
            </button>
          </div>

          {/* FLOATING ICONS */}
          <img src="/hero/alarm.png" className="icon alarm" alt="" />
          <img src="/hero/bulb.png" className="icon bulb" alt="" />
          <img src="/hero/like.png" className="icon like" alt="" />
        </div>

        {/* RIGHT */}
        <div className="hero-image">
          <img
            src="/hero/main.png"
            alt="student"
            className="hero-main-image"
          />

          <img
            src="/hero/success-badge.png"
            alt="Success students"
            className="hero-success"
          />
        </div>
      </div>

      {/* WAVE */}
      <img src="/hero/wave.png" className="hero-wave" alt="wave" />
    </section>
  );
}
