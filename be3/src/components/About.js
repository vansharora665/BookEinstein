import "../styles/about.css";

export default function About() {
  return (
    <section id="about" className="about">
      {/* Decorative star */}
      <img src="/about/star.png" className="about-star" alt="star" />

      <div className="about-inner">
        {/* LEFT IMAGES */}
        <div className="about-images">
          <img
            src="/about/1.png"
            className="about-img small"
            alt="about"
          />

          <div className="about-card">
            <img src="/about/3.png" alt="AI" />
          </div>

          <img
            src="/about/2.png"
            className="about-img main"
            alt="student"
          />

          {/* EXPERIENCE BADGE */}
          <div className="experience-pill">
            <img src="/about/bulb.png" alt="experience bulb" />

            <div className="exp-text">
              <div className="exp-top">
                <span className="exp-number">25+</span>
                <span className="exp-years">Years</span>
              </div>
              <span className="exp-label">of experience</span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="about-content">
          <span className="about-tag">● About Us</span>

          <h2>
            Built for Students, <br />
            Powered by <span>Curiosity</span>
          </h2>


          <p className="about-para">
  Learning shouldn’t feel confusing, boring, or overwhelming.
  We built this platform to help students learn with confidence —
  not pressure.
</p>

<p className="about-para">
  By blending technology, creativity, and real-world examples,
            we make complex ideas simple, engaging, and enjoyable. Our goal
            is to help students build skills that actually matter and feel
            excited about learning every day.
</p>

          <div className="about-features">
            {/* MISSION */}
            <div className="feature">
              <img
                src="/about/mission.png"
                alt="Mission"
                className="feature-img"
              />

              <div>
                <h4>Our Mission</h4>
                <p>
                  To help students learn smarter, think creatively, and build
                  future-ready skills through interactive,
                  technology-driven education.
                </p>
              </div>
            </div>

            {/* VISION */}
            <div className="feature">
              <img
                src="/about/vision.png"
                alt="Vision"
                className="feature-img"
              />

              <div>
                <h4>Our Vision</h4>
                <p>
                  To inspire a generation of confident learners by making
                  high-quality education accessible, engaging, and designed
                  around how students actually learn.
                </p>
              </div>
            </div>
          </div>

          <div className="about-actions">
            <button className="about-btn">» Know More</button>
            
          </div>
        </div>
      </div>
    </section>
  );
}
