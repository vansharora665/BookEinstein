// src/components/pages/TestQuizInline.jsx
import React from "react";
import ProfessionalQuiz from "./ProfessionalQuiz"; // adjust path if needed

export default function TestQuizInline({ module }) {
  const questions = (module && module.quiz && module.quiz[0] && module.quiz[0].length)
    ? module.quiz[0]
    : null;
  return (
    <div style={{ marginTop: 12, padding: 12, borderRadius: 12, background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
      <div style={{ marginBottom: 8 }}>
        <strong>Inline Quiz Test</strong>
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Renders the quiz inline</div>
      </div>
      <ProfessionalQuiz initialType="mixed" questions={questions} timePerQuestion={10} onComplete={(r)=>{ console.log("Inline done", r); alert(`score ${r.score}/${r.total}`); }} />
    </div>
  );
}
