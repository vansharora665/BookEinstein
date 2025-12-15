// src/components/ActivityWorkspace.js
import React, { useState, useRef, useEffect } from "react";
import ProfessionalQuiz from "./ProfessionalQuiz";

export default function ActivityWorkspace({ module = null, topicIndex = 0, onClose }) {
  const [step, setStep] = useState(null); 
  const [slideIndex, setSlideIndex] = useState(0);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleFsChange() {
      const fsElem = document.fullscreenElement || document.webkitFullscreenElement;
      setIsFullscreen(!!fsElem);
      if (!fsElem) setStep(null);
    }
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  const safeModule = module || {
    id: "demo",
    title: "Demo Module",
    topics: ["Sample topic"],
    topicDescriptions: ["This is a sample topic description."],
    videos: [],
    summaryVideos: [],
    topicSlides: [[]],
    quiz: [[]],
  };

  const topic = (safeModule.topics && safeModule.topics[topicIndex]) || `Topic ${topicIndex + 1}`;
  const introVideo = safeModule.videos?.[topicIndex] || "";
  const summaryVideo = safeModule.summaryVideos?.[topicIndex] || "";
  const slides = safeModule.topicSlides?.[topicIndex] || [];
  const questionsForTopic = safeModule.quiz?.[topicIndex] || [];

  async function enterFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      setIsFullscreen(true);
    } catch (e) {
      console.warn("Fullscreen request failed", e);
    }
  }

  async function exitFullscreen() {
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) await document.webkitExitFullscreen();
    } catch {}
  }

  function startFlow() {
    setSlideIndex(0);
    setStep("intro_video");
    enterFullscreen();
  }

  function handleNextFromIntro() {
    if (slides.length > 0) setStep("slides");
    else if (questionsForTopic.length > 0) setStep("quiz");
    else setStep("picture_hunt");
  }

  function handleSlidesNext() {
    if (slideIndex + 1 < slides.length) {
      setSlideIndex((s) => s + 1);
    } else {
      if (questionsForTopic.length > 0) setStep("quiz");
      else setStep("picture_hunt");
    }
  }

  function handleSlidesPrev() {
    if (slideIndex > 0) setSlideIndex((s) => s - 1);
  }

  function handleQuizComplete(result) {
    console.log("Flow quiz complete", result);
    setStep("picture_hunt");
  }

  function finishFlow() {
    setStep(null);
    exitFullscreen();
    onClose && onClose();
  }

  return (
    <div ref={containerRef} className="activity-workspace" style={{ padding: 12, position: "relative", minHeight: 300 }}>
      
      {/* ⭐ CHANGE — Header now fully hidden when flow begins */}
      <div className="activity-header" style={{ marginBottom: 12, display: step ? "none" : "flex" }}>
        <div style={{ flex: 1 }}>
          <div className="activity-breadcrumb" style={{ color: "var(--text-muted)" }}>
            {safeModule.title} • Topic {topicIndex + 1}
          </div>
          <h1 style={{ marginTop: 6 }}>{topic}</h1>
          <p className="activity-header-sub" style={{ color: "var(--text-muted)", marginTop: 4 }}>
            {safeModule.topicContents?.[topicIndex] || "Interactive activity"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="button" className="module-secondary-btn" onClick={() => setStep("intro_video")} style={{ minWidth: 120 }}>
            Intro video
          </button>

          <button type="button" className="module-primary-btn" onClick={startFlow} style={{ minWidth: 140 }}>
            Start full activity
          </button>

          {onClose && (
            <button type="button" className="module-secondary-btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>

      {/* FLOW FULLSCREEN VIEW */}
      {step && (
        <div className="activity-flow-container" style={{ position: "fixed", inset: 0, background: "var(--bg-elevated)", zIndex: 99999, padding: 20, overflow: "auto" }}>
          
          {/* FLOW HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {safeModule.title} • {topic}
              </div>
              <h2 style={{ margin: "6px 0 0 0" }}>
                {step === "intro_video" && "Intro video"}
                {step === "slides" && `Slides (${slideIndex + 1}/${Math.max(slides.length,1)})`}
                {step === "quiz" && "Quiz"}
                {step === "picture_hunt" && "Picture hunt"}
                {step === "summary_video" && "Summary"}
              </h2>
            </div>

            <button className="module-secondary-btn" onClick={() => { setStep(null); exitFullscreen(); }}>
              Exit
            </button>
          </div>

          <div style={{ background: "var(--bg)", borderRadius: 12, padding: 16 }}>
            
            {/* INTRO VIDEO */}
            {step === "intro_video" && (
              <div>
                {introVideo ? (
                  introVideo.includes("drive.google.com") ? (
                    <iframe title="intro" src={introVideo} style={{ width: "100%", height: "60vh", border: 0 }} allow="autoplay; encrypted-media" allowFullScreen />
                  ) : (
                    <video controls style={{ width: "100%" }} src={introVideo} />
                  )
                ) : (
                  <div style={{ padding: 20 }}>No intro video.</div>
                )}

                <div style={{ marginTop: 12, textAlign: "right" }}>
                  <button className="module-primary-btn" onClick={handleNextFromIntro}>Next</button>
                </div>
              </div>
            )}

            {/* SLIDES */}
            {step === "slides" && (
              <div>
                {slides.length ? (
                  <>
                    <div style={{ textAlign: "center", marginBottom: 12 }}>
                      <img src={slides[slideIndex]} style={{ width: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 8 }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <button className="module-secondary-btn" onClick={handleSlidesPrev} disabled={slideIndex === 0}>Prev</button>
                      <button className="module-primary-btn" onClick={handleSlidesNext}>
                        {slideIndex + 1 < slides.length ? "Next slide" : "Proceed to quiz"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div>No slides.</div>
                )}
              </div>
            )}

            {/* QUIZ */}
            {step === "quiz" && (
              <>
                <ProfessionalQuiz
                  initialType="mixed"
                  questions={questionsForTopic}
                  timePerQuestion={20}
                  onComplete={handleQuizComplete}
                />
              </>
            )}

            {/* PICTURE HUNT PLACEHOLDER */}
            {step === "picture_hunt" && (
              <>
                <p>Picture hunt coming soon...</p>
                <button className="module-primary-btn" onClick={() => setStep("summary_video")}>
                  Next
                </button>
              </>
            )}

            {/* SUMMARY VIDEO */}
            {step === "summary_video" && (
              <div>
                {summaryVideo ? (
                  summaryVideo.includes("drive.google.com") ? (
                    <iframe title="summary" src={summaryVideo} style={{ width: "100%", height: "60vh" }} />
                  ) : (
                    <video controls style={{ width: "100%" }} src={summaryVideo} />
                  )
                ) : (
                  <p>No summary video.</p>
                )}
                <div style={{ textAlign: "right", marginTop: 12 }}>
                  <button className="module-primary-btn" onClick={finishFlow}>Finish</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ⭐ CHANGE — Next button added to default canvas */}
      {!step && (
        <div className="activity-primary" style={{ marginTop: 12 }}>
          <div className="activity-media-card">
            <p className="activity-label">Activity canvas</p>
            <p>Press NEXT to preview the flow.</p>

            <button
              className="module-primary-btn"
              onClick={() => setStep("intro_video")}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Sidebar (Auto-hidden) */}
      {!step && (
        <aside className="activity-sidebar">
          <div className="activity-meta-card">
            <h3>Activity outline</h3>
            <ol>
              <li>Warm-up</li>
              <li>Video</li>
              <li>Slides</li>
              <li>Quiz</li>
              <li>Summary</li>
            </ol>
          </div>

          <div className="activity-meta-card" style={{ marginTop: 10 }}>
            <h3>Teacher notes</h3>
            <p style={{ color: "var(--text-muted)" }}>
              {safeModule.teacherNotes?.[topicIndex] || "No notes added."}
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}
