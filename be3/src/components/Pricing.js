import "../styles/pricing.css";

export default function Pricing() {
  return (
    <section id="contact" className="pricing">
      <div className="contact-cta">
        {/* LEFT CONTENT */}
        <div className="contact-content">
          <span className="contact-tag">📞 Contact Us</span>

          <h3>Let’s Build Your Learning Journey Together</h3>

          <p>
            Have questions about our courses, curriculum, or learning approach?
            Our team is here to guide you every step of the way. Reach out to us
            anytime — we’d love to hear from you.
          </p>

          <div className="contact-details">
            <div>
              <strong>Email:</strong> support@yourplatform.com
            </div>
            <div>
              <strong>Phone:</strong> +91 98765 43210
            </div>
            <div>
              <strong>Location:</strong> Bengaluru, India
            </div>
          </div>

          <button className="contact-btn">Get in Touch</button>
        </div>

        {/* RIGHT IMAGE */}
        <img src="/pricing/cta.png" alt="Contact illustration" />
      </div>
    </section>
  );
}
