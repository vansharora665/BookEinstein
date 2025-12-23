import "../styles/pricing.css";

export default function Pricing() {
  return (
    <section className="pricing">
      <h2>
        Your Source for Ideas, <br />
        Insights, and <span>Inspiration</span>
      </h2>

      <div className="price-grid">
        {["Basic","Standard","Premium"].map(plan => (
          <div key={plan} className="price-card">
            <h3>{plan}</h3>
            <ul>
              <li>✔ Courses</li>
              <li>✔ Videos</li>
              <li>✔ Enhanced Security</li>
            </ul>
            <button>Enroll Now</button>
          </div>
        ))}
      </div>

      <div className="cta">
        <div>
          <h3>Ready to Grow with Logo?</h3>
          <p>Lorem ipsum dolor sit amet consectetur.</p>
          <button>Get Started</button>
        </div>
        <img src="/pricing/cta.png" alt="cta" />
      </div>
    </section>
  );
}
