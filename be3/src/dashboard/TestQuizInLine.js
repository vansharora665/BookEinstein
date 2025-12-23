// src/components/pages/TestQuizInline.jsx
import React from "react";
import ProfessionalQuiz from "./ProfessionalQuiz"; // adjust path if needed

export default function TestQuizInline({ module, topicIndex }) {
  const questions =
    module &&
    module.quiz &&
    module.quiz[topicIndex] &&
    module.quiz[topicIndex].length > 0
      ? module.quiz[topicIndex]
      : null;

  return (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {questions ? (
        <>
          <div style={{ marginBottom: 8 }}>
            <strong>Quiz</strong>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Answer the questions to continue
            </div>
          </div>

          <ProfessionalQuiz
            initialType="mixed"
            questions={questions}
            timePerQuestion={15}
            onComplete={(result) => {
              console.log("Quiz completed:", result);
            }}
          />
        </>
      ) : (
        <div style={{ padding: 20, color: "#777" }}>
          No quiz available for this topic.
        </div>
      )}
    </div>
  );
}
