import React from "react";
import ReviewCard from "./ReviewCard";

function LandingPage({ heroTiles, basicModules }) {
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-left">
          <h1>
            Learn <span className="accent">AI</span> like a pro,
            <br />
            even before college.
          </h1>
          <p className="hero-subtitle">
            Book Einstein helps Class 9–12 students understand AI concepts through
            colourful visuals, real-life examples, and interactive challenges.
          </p>

          <div className="hero-search">
            <input
              type="text"
              placeholder="Search for your AI topic (e.g. ‘What is machine learning?’)"
            />
            <button className="search-btn">Explore</button>
          </div>

          <p className="hero-small">
            Are you a qualified, professional teacher?{" "}
            <button className="link-btn">Join us</button>
          </p>

          <div className="hero-stats">
            <div>
              <span className="stat-number">8k+</span>
              <span className="stat-label">Students learning AI</span>
            </div>
            <div>
              <span className="stat-number">120+</span>
              <span className="stat-label">Schools on board</span>
            </div>
            <div>
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Average rating</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-decor hero-decor-1" />
          <div className="hero-decor hero-decor-2" />
          <div className="mosaic-grid">
            {heroTiles.map((tile, index) => (
              <div
                key={tile.id}
                className={`mosaic-tile ${tile.shape} ${tile.color} tile-pos-${index + 1}`}
              >
                <div
                  className="tile-image"
                  style={{ backgroundImage: `url(${tile.img})` }}
                />
                <div className="tile-overlay">
                  <p className="tile-tag">{tile.tag}</p>
                  <p className="tile-label">{tile.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="modules-preview">
        <div className="section-header">
          <h2>Start with simple, visual modules</h2>
          <p>Perfectly tuned for Class 9–12 — no coding required.</p>
        </div>
        <div className="card-grid">
          {basicModules.map((m) => (
            <div key={m.title} className="module-card">
              <div className="module-tag">{m.level}</div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
              <button className="small-cta">See lesson preview →</button>
            </div>
          ))}
        </div>
      </section>

      <section className="reviews">
        <div className="section-header">
          <h2>Parents & students love the experience</h2>
          <p>Short classes, clear explanations, and hands-on practice.</p>
        </div>
        <div className="reviews-grid">
          <ReviewCard
            name="Mrs. Sharma"
            role="Parent of Class 10 student"
            text="My son finally understands what AI actually means, not just buzzwords. He now explains it to us at dinner!"
          />
          <ReviewCard
            name="Kabir"
            role="Class 11"
            text="The leaderboard and quizzes make it feel like a game. I’m actually excited to learn after school."
          />
          <ReviewCard
            name="Ananya"
            role="Class 9"
            text="I built a tiny AI project predicting exam moods. It was fun and surprisingly easy with their guidance."
          />
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
