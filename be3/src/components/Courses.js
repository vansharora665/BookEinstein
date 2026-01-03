import "../styles/courses.css";

export default function Courses() {
  return (
    <section id="courses" className="courses">
      {/* HEADER */}
      <span className="section-tag">🎓 Our Courses</span>
      <h2 className="courses-title">
        Explore Our Comprehensive <br />
        Course <span>Offerings</span>
      </h2>

      {/* CATEGORY FILTER (STATIC UI) */}
      <div className="course-filters">
        <button className="filter active">All Categories</button>
        <button className="filter">Design</button>
        <button className="filter">Programming</button>
        <button className="filter">Marketing</button>
      </div>

      {/* COURSE GRID */}
      <div className="course-grid">
        {[1, 2, 3].map((i) => (
          <div className="course-card" key={i}>
            <div className="course-image">
              <img src={`/courses/course-${i}.png`} alt="course" />
              <span className="wishlist">♡</span>
            </div>

            <div className="course-body">
              <div className="course-meta">
                <span className="price">₹240.00</span>
                <span className="rating">⭐ 4.5 (129)</span>
              </div>

              <h4>
                Getting Started with Computers and Beginner’s Guide to
                Essential Skills
              </h4>

              <button className="enroll-btn">
                Enroll Now →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* REVIEWS */}
      <div className="reviews">
        <h3>
          Stories from <span>Skillery</span> Learners
        </h3>
        <p className="review-sub">
          Real experiences from students who learned, built, and grew with us.
        </p>

        <div className="review-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="review-card">
              <div className="stars">★★★★★</div>
              <h4>Lorem ipsum dolor sit amet</h4>
              <p>
                The courses were easy to follow, engaging, and helped me build
                confidence with real-world projects.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
