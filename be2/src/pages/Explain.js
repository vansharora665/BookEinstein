// src/pages/Explain.js
import React, { useState } from "react";
import ProfessionalQuiz from "./ProfessionalQuiz";
import PictureHunt from "../components/PictureHunt";
import { PICTURE_HUNT_CONFIG } from "../config/pictureHuntConfig";


export default function Explain({ module, topicIndex = 0 }) {
  // ✅ ALL hooks at top
  const [step, setStep] = useState("intro");
  const [slideIndex, setSlideIndex] = useState(0);

  // ✅ SAFE guards AFTER hooks
  if (!module) {
    return <div style={{ padding: 20 }}>No module selected.</div>;
  }

  const topic = module.topics?.[topicIndex] || `Topic ${topicIndex + 1}`;
  const introVideo = module.videos?.[topicIndex];
  const slides = module.topicSlides?.[topicIndex] || [];
  const quizQuestions = module.quiz?.[topicIndex] || [];
  const pictureImage = module.topicImages?.[topicIndex];
  const summaryVideo = module.summaryVideos?.[topicIndex];
  const pictureHuntConfig = PICTURE_HUNT_CONFIG?.[module.id]?.[topicIndex] || null;

  


  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>{module.title} — {topic}</h1>

      {/* INTRO */}
      {step === "intro" && (
        <>
          <h2>Intro Video</h2>
          {introVideo ? (
            introVideo.includes("drive.google.com") ? (
              <iframe src={introVideo} title="intro" style={{ width: "100%", height: 400 }} />
            ) : (
              <video controls src={introVideo} style={{ width: "100%" }} />
            )
          ) : <p>No intro video</p>}

          <button className="module-primary-btn" onClick={() => setStep("slides")}>
            Next →
          </button>
        </>
      )}

      {/* SLIDES */}
      {step === "slides" && (
        <>
          <h2>Slides</h2>
          {slides.length ? (
            <img src={slides[slideIndex]} alt="" style={{ width: "100%" }} />
          ) : <p>No slides</p>}

          <div style={{ display: "flex", gap: 8 }}>
            <button className="module-secondary-btn" onClick={() => setStep("intro")}>← Back</button>
            <button
              className="module-primary-btn"
              onClick={() =>
                slideIndex + 1 < slides.length
                  ? setSlideIndex(slideIndex + 1)
                  : setStep("quiz")
              }
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* QUIZ */}
      {step === "quiz" && (
        <>
          <h2>Quiz</h2>
          <ProfessionalQuiz
            questions={quizQuestions}
            onComplete={() => setStep("picture")}
          />
        </>
      )}

      {/* ---------------------- PICTURE HUNT ---------------------- */}
      {step === "picture" && (
  <div>
    <h2>Picture Hunt</h2>

    {pictureHuntConfig?.image ? (
      <PictureHunt
        image={pictureHuntConfig.image}   // ✅ REQUIRED
        hotspots={pictureHuntConfig.hotspots}
        timeLimit={pictureHuntConfig.timeLimit || 45}
        onComplete={() => setStep("summary")}
      />
    ) : (
      <p>No picture hunt configured for this topic.</p>
    )}

    <div style={{ marginTop: 16 }}>
      <button
        className="module-secondary-btn"
        onClick={() => setStep("quiz")}
      >
        ← Back
      </button>

      <button
        className="module-primary-btn"
        onClick={() => setStep("summary")}
      >
        Next →
      </button>
    </div>
  </div>
)}




      {/* SUMMARY */}
      {step === "summary" && (
        <>
          <h2>Summary Video</h2>
          {summaryVideo ? (
            summaryVideo.includes("drive.google.com") ? (
              <iframe src={summaryVideo} title="summary" style={{ width: "100%", height: 400 }} />
            ) : (
              <video controls src={summaryVideo} style={{ width: "100%" }} />
            )
          ) : <p>No summary video</p>}

          <button
                className="module-secondary-btn"
                onClick={() => setStep("picture")}
            >
                ← Back
            </button>

          <button className="module-primary-btn" onClick={() => window.history.back()}>
            Finish
          </button>
        </>
      )}
    </div>
  );
}
