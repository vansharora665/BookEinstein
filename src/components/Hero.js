import "../styles/hero.css";


export default function Hero() {
  return (
    <section className="hero">
      {/* BACKGROUND TEXTURE (CSS or IMAGE) */}
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
            Learn <span className="ai">AI</span> Like A Pro <br />
            Even Before <span className="your">Your</span> <br />
            <span className="college">College</span>
          </h1>
          <span className="hero-curve"></span>

          <p>
            Convenience of online education, allowing learners to acquire new
            skills at their own pace and from any location.
          </p>

          <div className="hero-actions">
  <button className="hero-btn">
    Enroll Now
    <span className="arrow">→</span>
  </button>

  <button className="secondary">
    🎥 Quality Video
  </button>

  <button className="secondary">
    💰 Suitable Price
  </button>
</div>


          {/* FLOATING ICONS */}
          <img src="/hero/alarm.png" className="icon alarm" />
          <img src="/hero/bulb.png" className="icon bulb" />
          <img src="/hero/like.png" className="icon like" />
        </div>

        {/* RIGHT */}
        <div className="hero-image">
          <img src="/hero/main.png" alt="student" className=".hero-main-image"/>

          <img
  src="/hero/success-badge.png"
  alt="Success students"
  className="hero-success"
/>

        </div>
      </div>

      {/* WAVE BOTTOM */}
      <img src="/hero/wave.png" className="hero-wave" alt="wave" />
    </section>
  );
}
