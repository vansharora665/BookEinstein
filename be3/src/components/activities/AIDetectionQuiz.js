import { useState } from "react";

/**
 * AIDetectionQuiz
 *
 * question = {
 *   image: "url",
 *   correct: "ai" | "not-ai",
 *   followUp?: {
 *     question: "Why is this AI?",
 *     options: ["A", "B", "C", "D"],
 *     answerIndex: 2
 *   }
 * }
 */
export default function AIDetectionQuiz({ question, onComplete }) {
  const [step, setStep] = useState("primary"); // primary | followup | done
  const [selected, setSelected] = useState(null);
  const [followAnswer, setFollowAnswer] = useState(null);
  const [result, setResult] = useState(null);

  function handlePrimary(choice) {
    setSelected(choice);

    if (choice === question.correct) {
      if (choice === "ai" && question.followUp) {
        setStep("followup");
      } else {
        setResult(true);
        setStep("done");
      }
    } else {
      setResult(false);
      setStep("done");
    }
  }

  function handleFollowUp(i) {
    setFollowAnswer(i);
    const correct = i === question.followUp.answerIndex;
    setResult(correct);
    setStep("done");
  }

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* IMAGE */}
      <img
        src={question.image}
        alt="AI detection"
        style={{
          maxWidth: "100%",
          maxHeight: 420,
          objectFit: "contain",
          borderRadius: 16,
          marginBottom: 20,
        }}
      />

      {/* PRIMARY QUESTION */}
      {step === "primary" && (
        <>
          <h3>Is this AI generated?</h3>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              className="module-primary-btn"
              onClick={() => handlePrimary("ai")}
            >
              AI
            </button>
            <button
              className="module-secondary-btn"
              onClick={() => handlePrimary("not-ai")}
            >
              Not AI
            </button>
          </div>
        </>
      )}

      {/* FOLLOW-UP QUESTION */}
      {step === "followup" && (
        <>
          <h3 style={{ marginBottom: 12 }}>
            {question.followUp.question}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {question.followUp.options.map((opt, i) => (
              <button
                key={i}
                className="module-secondary-btn"
                onClick={() => handleFollowUp(i)}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {/* RESULT */}
      {step === "done" && (
        <>
          <h3 style={{ marginTop: 20 }}>
            {result ? "✅ Correct!" : "❌ Incorrect"}
          </h3>
          <button
            className="module-primary-btn"
            style={{ marginTop: 12 }}
            onClick={onComplete}
          >
            Continue →
          </button>
        </>
      )}
    </div>
  );
}
