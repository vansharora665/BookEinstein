import "../styles/courses.css";

export default function Courses() {
  return (
    <section className="courses">
      <span className="section-tag">🎓 Our Courses</span>
      <h2>
        Explore Our Comprehensive <br />
        Course <span>Offerings</span>
      </h2>

      <div className="course-grid">
        {[1,2,3].map(i => (
          <div className="course-card" key={i}>
            <img src={`/courses/course-${i}.png`} alt="course" />
            <div className="course-body">
              <span className="price">₹240.00</span>
              <h4>Getting Started with Computers</h4>
              <button>Enroll Now →</button>
            </div>
          </div>
        ))}
      </div>

      <div className="reviews">
        <h3>
          Stories from <span>Skillery</span> Learners
        </h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        <div className="review-grid">
          {[1,2,3].map(i => (
            <div key={i} className="review-card">
              ⭐⭐⭐⭐⭐
              <h4>Lorem ipsum dolor sit amet</h4>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
                eiusmod tempor.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
