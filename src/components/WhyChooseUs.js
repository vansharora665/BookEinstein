import "../styles/whyChooseUs.css";

export default function WhyChooseUs() {
  return (
    <section className="why">
      <div className="why-left">
        <span className="why-tag">🎓 Why Choose Us</span>
        <h2>
          Discover Why Our Student <br />
          and Clients <span>Choose Us</span>
        </h2>
        <p>
          Meet the talented individuals who bring our vision to life every day.
          With a shared passion and commitment, our team works tirelessly to
          deliver exceptional quality and innovation.
        </p>

        <div className="why-join">
  <div className="why-join-text">
    <h3>Join Our Classes</h3>
    <p>
      Convenience of online education, allowing learners to acquire new
      skills at their own pace and from any location.
    </p>
  </div>

  <img src="/why/join.png" alt="Join Our Classes" className="join-img"/>
</div>

      </div>

      <div className="why-right">
        {[
          { img: "/why/ai.png", title: "AI-Driven Personalization" },
          { img: "/why/gamified.png", title: "Gamified Learning Modules" },
          { img: "/why/mobile.png", title: "Mobile-Optimized Learning" },
          { img: "/why/analytics.png", title: "Real-Time Analytics and Reporting" },
        ].map((item, i) => (
          <div key={i} className="why-card">
            <img src={item.img} alt={item.title} />
            <h4>{item.title}</h4>
            <p>
              Our platform leverages AI to tailor learning paths to individual
              users.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
