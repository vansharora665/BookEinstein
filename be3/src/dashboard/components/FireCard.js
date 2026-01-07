import { useMemo } from "react";

const AI_QUOTES = [
  "Small steps in learning today create big opportunities tomorrow.",
  "AI isn’t about memorizing answers — it’s about learning how to think.",
  "Every concept you learn today makes tomorrow’s tech easier.",
  "The future belongs to those who learn continuously.",
  "You don’t need to be perfect — you just need to start.",
  "Learning AI early gives you a superpower for life.",
  "Curiosity is the real engine behind intelligence.",
  "One lesson a day is how experts are made.",
];

export default function FireCard({ userName = "Learner", onStart }) {
  // Pick ONE quote per visit
  const quote = useMemo(() => {
    return AI_QUOTES[Math.floor(Math.random() * AI_QUOTES.length)];
  }, []);

  return (
    <div className="fire-card">
      <h3>
        You're on fire, {userName} <span>🔥</span>
      </h3>

      <p>{quote}</p>

      <button onClick={onStart}>
        Start Learning
      </button>
    </div>
  );
}
