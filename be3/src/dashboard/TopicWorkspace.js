import { useMemo, useState, useEffect, useRef } from "react";
import ProfessionalQuiz from "./ProfessionalQuiz";
import "./learning.css";
import AIDetectionQuiz from "../components/activities/AIDetectionQuiz";
import AiOrNotGame from "../games/AiOrNot";
import TopicActivityNav from "./TopicActivityNav";

export default function TopicWorkspace({
  module,
  topicIndex,
  onExit,
}) {
  /* ===============================
     STATE
  =============================== */
  const [step, setStep] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const bodyRef = useRef(null);
  useEffect(() => {
  document.body.classList.toggle("fullscreen-active", fullscreen);
  return () => document.body.classList.remove("fullscreen-active");
}, [fullscreen]);




  /* ===============================
     SCROLL RESET ON STEP CHANGE
  =============================== */
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  /* ===============================
     BUILD ACTIVITIES (SAFE)
  =============================== */
  const blocks = useMemo(() => {
    const arr = [];

    const activities = module.activities?.[topicIndex] || [];

    activities.forEach((item, i) => {
      if (!item || !item.type) return;

      arr.push({
        ...item,
        id: item.id || `activity-${topicIndex}-${i}`,
        title: item.title || (
          item.type === "video" ? "Video" :
          item.type === "image" ? "Image" :
          item.type === "audio" ? "Audio" :
          item.type === "quiz"  ? "Quiz" :
          "Interactive"
        ),
      });
    });

    if (module.summaryVideos?.[topicIndex]) {
      arr.push({
        type: "video",
        title: "Summary Video",
        src: module.summaryVideos[topicIndex],
      });
    }

    return arr;
  }, [module, topicIndex]);
  useEffect(() => {
  function handleKey(e) {
    if (e.key === "f") {
      setFullscreen(f => !f);
    }
    if (e.key === "ArrowRight") {
      setStep(s => Math.min(s + 1, blocks.length - 1));
    }
    if (e.key === "ArrowLeft") {
      setStep(s => Math.max(s - 1, 0));
    }
  }

  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [blocks.length]);

  /* ===============================
     CURRENT ACTIVITY (SAFE)
  =============================== */
  const current = blocks[step] ?? null;
  const courseTitle = module.courseTitle || "Course";
const moduleTitle = module.title;
const topicTitle = module.topics?.[topicIndex];
const activityTitle = current?.title;


  /* ===============================
     QUIZ DATA
  =============================== */
  const quizQuestions =
    module.quiz?.[topicIndex]?.length > 0
      ? module.quiz[topicIndex]
      : null;

  /* ===============================
     EMPTY STATE
  =============================== */
  if (!current) {
    return (
      <div className="topic-workspace">
        <p>No content available for this topic.</p>
        <button onClick={onExit}>← Back</button>
      </div>
    );
  }
  

  /* ===============================
     RENDER
  =============================== */
  return (

    

    <div className="topic-workspace">
      {/* BRAND LOGO */}
      


      <div className={`workspace-layout ${fullscreen ? "fullscreen" : ""} ${navCollapsed ? "nav-collapsed" : ""}`}>
        {/* LEFT NAV */}
        <TopicActivityNav
  activities={blocks}
  activeIndex={step}
  onSelect={setStep}
  collapsed={navCollapsed}
  setCollapsed={setNavCollapsed}
  hidden={fullscreen}
/>


        {/* ACTIVITY */}
        <div className={`activity-shell ${fullscreen ? "fullscreen" : ""}`}>
          {/* HEADER */}
          <div className="activity-header">
            <h3>{current.title}</h3>
            

          </div>
          <button
  className="fullscreen-fab"
  onClick={() => setFullscreen(!fullscreen)}
>
  ⛶
</button>

          {!fullscreen && (
  <div className="workspace-breadcrumb">
    <span>{courseTitle}</span>
    <span>›</span>
    <span>{moduleTitle}</span>
    <span>›</span>
    <span>{topicTitle}</span>
    <span>›</span>
    <strong>{activityTitle}</strong>
  </div>
)}

          {/* BODY */}
          <div className="activity-body" ref={bodyRef}>
            {current.type === "audio" && (
              <audio controls style={{ width: "100%" }}>
                <source src={current.src} />
              </audio>
            )}

            {current.type === "video" && (
              <iframe
                src={current.src}
                title={current.id}
                allow="autoplay; fullscreen"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            )}

            {current.type === "image" && (
              <img
                src={current.src}
                alt="activity"
                loading="lazy"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: 16,
                }}
              />
            )}

            {current.type === "game" && current.game === "AiOrNot" && (
              <AiOrNotGame />
            )}

            {current.type === "iframe" && (
              <iframe
                src={current.src}
                title={current.id}
                allowFullScreen
                loading="lazy"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            )}

            {current.type === "quiz" &&
              (quizQuestions ? (
                <ProfessionalQuiz
                  initialType="mixed"
                  questions={quizQuestions}
                  timePerQuestion={15}
                />
              ) : (
                <div style={{ padding: 20, color: "#777" }}>
                  No quiz available.
                </div>
              ))}

            {current.type === "ai-detection" && (
              <AIDetectionQuiz
                question={current.data}
                onComplete={() => {
                  if (step < blocks.length - 1) {
                    setStep(step + 1);
                  } else {
                    onExit();
                  }
                }}
              />
            )}
          </div>

          {/* FOOTER */}
          <div className="activity-footer">
            <div className="activity-footer-left">
              <button className="back-btn" onClick={onExit}>
                ← Back to Topics
              </button>

              <button
                className="prev-btn"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                ← Previous
              </button>
            </div>

            <div className="activity-footer-right">
              {step < blocks.length - 1 ? (
                <button
                  className="next-btn"
                  onClick={() => {
                    const increment = Math.round(100 / blocks.length);
                    window.updateTopicProgress?.(
                      module.id,
                      topicIndex,
                      increment
                    );
                    setStep(step + 1);
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  className="complete-btn"
                  onClick={() => {
                    window.updateTopicProgress?.(
                      module.id,
                      topicIndex,
                      100
                    );
                    onExit();
                  }}
                >
                  Mark Topic Complete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
