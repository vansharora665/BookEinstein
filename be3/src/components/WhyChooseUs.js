import { useEffect, useRef } from "react";
import "../styles/whyChooseUs.css";

export default function WhyChooseUs() {
  const itemsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ladder-visible");
          }
        });
      },
      { threshold: 0.25 }
    );

    itemsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="why">
      {/* LEFT */}
      <div className="why-left">
        <h2 className="why-title">
          Discover Why Our Students <br />
          and Clients <span>Choose Us</span>
        </h2>

        <p className="why-desc">
  We design learning experiences that feel simple, motivating, and genuinely
  useful. By blending technology, expert guidance, and real-world relevance,
  we help students understand concepts clearly instead of memorizing them.
  Our approach focuses on building confidence, curiosity, and practical skills
  — so learning feels empowering, not overwhelming.
</p>


        <div className="why-join">
          <div className="why-join-text">
            <h3>Join Our Classes</h3>

            <p className="join-sub">
              Learn anytime, anywhere through structured lessons, expert mentor
              support, and hands-on projects that make concepts easy to
              understand and apply.
            </p>

            <p className="join-sub">
              Designed especially for school and college-bound students who
              want clarity, confidence, and real skills.
            </p>

            <span className="join-meta">
              Live sessions • Doubt clearing • Projects
            </span>
          </div>

          <img src="/why/join.png" alt="Join Our Classes" className="join-img" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="why-right">
        {[
          {
            img: "/why/ai.png",
            title: "AI-Driven Personalization",
            text:
              "Learning paths intelligently adapt to each student’s pace, strengths, and learning goals — so no one feels left behind or rushed."
          },
          {
            img: "/why/gamified.png",
            title: "Gamified Learning Modules",
            text:
              "Interactive challenges, quizzes, and activities turn learning into an engaging experience that keeps students curious and motivated."
          },
          {
            img: "/why/mobile.png",
            title: "Mobile-Optimized Learning",
            text:
              "Access lessons seamlessly across devices, allowing students to learn comfortably at home, in class, or on the go."
          },
          {
            img: "/why/analytics.png",
            title: "Real-Time Analytics & Insights",
            text:
              "Track progress clearly with smart insights, helping students understand strengths, improve weak areas, and grow consistently."
          }
        ].map((item, i) => (
          <div
            key={i}
            ref={(el) => (itemsRef.current[i] = el)}
            className={`why-item ladder-${i + 1}`}
          >
            <div className="why-icon">
              <img src={item.img} alt={item.title} />
            </div>

            <div>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
