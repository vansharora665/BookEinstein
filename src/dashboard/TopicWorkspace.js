import { useMemo, useState, useEffect, useRef } from "react";
import ProfessionalQuiz from "./ProfessionalQuiz";
import "./learning.css";
import AIDetectionQuiz from "../components/activities/AIDetectionQuiz";
import AiOrNotGame from "../games/AiOrNot";



export default function TopicWorkspace({
  module,
  topicIndex,
  onExit,
}) {
  const [step, setStep] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);
  useEffect(() => {
    // ENTER focus mode
    document.body.classList.add("workspace-active");

    return () => {
      // EXIT focus mode
      document.body.classList.remove("workspace-active");
    };
  }, []);

  const blocks = useMemo(() => {
  const arr = [];

  

  // INTRO (always first)
//   arr.push({
//     id: `intro-${topicIndex}`,
//     type: "intro",
//     title: "Introduction",
//   });

  // ✅ ACTIVITIES (already parsed by mapper)
  const activities = module.activities?.[topicIndex] || [];

  activities.forEach((item, i) => {
    if (!item || !item.type) return;

    arr.push({
      ...item,

      // 🔑 KEEP mapper-generated id if present
      id: item.id || `activity-${topicIndex}-${i}`,

      title:
        item.type === "video" ? "Video" :
        item.type === "image" ? "Image" :
        item.type === "audio" ? "Audio" :
        item.type === "quiz"  ? "Quiz" :
        "Interactive",
    });
  });


    // SUMMARY VIDEO (optional, last)
    if (module.summaryVideos?.[topicIndex]) {
      arr.push({
        type: "video",
        title: "Summary Video",
        src: module.summaryVideos[topicIndex],
      });
    }

    return arr;
  }, [module, topicIndex]);

  const current = blocks[step] || null;

  const quizQuestions =
    module.quiz?.[topicIndex] && module.quiz[topicIndex].length > 0
      ? module.quiz[topicIndex]
      : null;

  if (!current) {
    return (
      <div className="topic-workspace">
        <p>No content available for this topic.</p>
        <button onClick={onExit}>← Back</button>
      </div>
    );
  }
  
  return (
    <div className="topic-workspace">

      {/* 🔰 BRAND LOGO – visible whenever activity is open */}
<div className="workspace-logo">
  <img src="/navbar/logo.png" alt="Platform Logo" />
</div>

      <h1>{module.topics?.[topicIndex]}</h1>
      

      <div className={`activity-shell ${fullscreen ? "fullscreen" : ""}`}>

        {/* HEADER */}
        <div className="activity-header">
          <h3>{current.title || "Activity"}</h3>
          <button
            className="fullscreen-btn"
            onClick={() => setFullscreen(!fullscreen)}
          >
            ⛶
          </button>
        </div>

        {/* BODY */}
        <div className="activity-body" ref={bodyRef}>
          

          {current.type === "audio" && (
            <audio key={current.id} controls style={{ width: "100%" }}>
              <source src={current.src} />
            </audio>
          )}

          {current.type === "video" && (
            <iframe
              key={current.id}
              src={current.src}
              title={current.id}
              allow="autoplay; fullscreen"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          )}

          {current.type === "image" && (
            <img
              key={current.id}
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
  <div style={{ width: "100%", height: "100%" }}>
    <AiOrNotGame />
  </div>
)}


          {current.type === "iframe" && (
            <iframe
              key={current.id}
              src={current.src}
              title={current.id}
              allow="fullscreen"
              allowFullScreen
              loading="lazy"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          )}

          {current.type === "quiz" && (
            quizQuestions ? (
              <ProfessionalQuiz
                initialType="mixed"
                questions={quizQuestions}
                timePerQuestion={15}
                onComplete={(r) =>
                  console.log("Quiz completed:", r)
                }
              />
            ) : (
              <div style={{ padding: 20, color: "#777" }}>
                No quiz available.
              </div>
            )
          )}
        </div>
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

        {/* FOOTER */}
        <div className="activity-footer">
  {/* LEFT SIDE */}
  <div className="activity-footer-left">
    <button
      className="back-btn"
      onClick={onExit}
    >
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

  {/* RIGHT SIDE */}
  <div className="activity-footer-right">
    {step < blocks.length - 1 ? (
      <button
        className="next-btn"
        onClick={() => {
          const percentPerActivity = Math.round(100 / blocks.length);

          window.updateTopicProgress?.(
            module.id,
            topicIndex,
            percentPerActivity
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
  );
}
