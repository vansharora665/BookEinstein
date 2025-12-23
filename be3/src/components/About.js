import "../styles/about.css";


export default function About() {
  return (
    <section className="about">
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
            <img
              src="/about/3.png"
              alt="AI"
            />
          </div>

          <img
            src="/about/2.png"
            className="about-img main"
            alt="student"
          />

          {/* EXPERIENCE BADGE (CSS GENERATED) */}
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
            Our Story: Built On Values, <br />
            Driven By <span>Innovation</span>
          </h2>

          <p>
            We are dedicated to transforming education through digital
            innovation, making learning more accessible, engaging, and
            effective for everyone. By integrating cutting-edge technology,
            we aim to create an inclusive and dynamic learning environment.
          </p>

          <div className="about-features">
            <div className="feature">
              <div className="icon mission"></div>
              <div>
                <h4>Our Mission</h4>
                <p>
                  To provide innovative digital education solutions that
                  empower learners and educators.
                </p>
              </div>
            </div>

            <div className="feature">
              <div className="icon vision"></div>
              <div>
                <h4>Our Vision</h4>
                <p>
                  To be a leader in digital education, enabling lifelong
                  learning through accessible platforms.
                </p>
              </div>
            </div>
          </div>

          <div className="about-actions">
            <button className="about-btn">» Know More</button>
            <span className="live-class">Live Class</span>
          </div>
        </div>
      </div>
    </section>
  );
}
