import React, { useEffect, useRef, useState } from "react";

/**
 * props:
 *  - image: string
 *  - hotspots: [{ x, y, radius, correct }]
 *  - timeLimit: number
 *  - onComplete(score)
 */
export default function PictureHunt({
  image,
  hotspots = [],
  timeLimit = 45,
  onComplete,
}) {
  const containerRef = useRef(null);

  const correctSound = useRef(new Audio("/sounds/correct.mp3"));
  const wrongSound = useRef(new Audio("/sounds/wrong.mp3"));

  const totalCorrect = hotspots.filter(h => h.correct).length;

  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [foundIds, setFoundIds] = useState([]);
  const [score, setScore] = useState(0);

  // init sounds
  useEffect(() => {
    correctSound.current.volume = 0.8;
    wrongSound.current.volume = 0.8;
  }, []);

  // timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.(score);
      return;
    }

    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, score, onComplete]);

  function handleClick(e) {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let hitIndex = -1;

    hotspots.forEach((h, idx) => {
      if (foundIds.includes(idx)) return;

      const dx = clickX - h.x;
      const dy = clickY - h.y;
      if (Math.sqrt(dx * dx + dy * dy) <= h.radius) {
        hitIndex = idx;
      }
    });

    if (hitIndex === -1) {
      wrongSound.current.currentTime = 0;
      wrongSound.current.play();
      return;
    }

    const hit = hotspots[hitIndex];

    if (hit.correct) {
      correctSound.current.currentTime = 0;
      correctSound.current.play();

      setFoundIds(prev => [...prev, hitIndex]);
      setScore(prev => prev + 10);
    } else {
      wrongSound.current.currentTime = 0;
      wrongSound.current.play();
    }
  }

  // finish when all found
  useEffect(() => {
    if (foundIds.length === totalCorrect && totalCorrect > 0) {
      setTimeout(() => onComplete?.(score), 700);
    }
  }, [foundIds, totalCorrect, score, onComplete]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong>Find the AI objects ({foundIds.length}/{totalCorrect})</strong>
        <span>⏱ {timeLeft}s</span>
      </div>

      <div
        ref={containerRef}
        onClick={handleClick}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 800,
          cursor: "crosshair",
          userSelect: "none",
        }}
      >
        <img
          src={image}
          alt="Picture Hunt"
          style={{ width: "100%", borderRadius: 12 }}
          draggable={false}
        />

        {/* highlight found */}
        {hotspots.map((h, i) =>
          foundIds.includes(i) ? (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${h.x - h.radius}%`,
                top: `${h.y - h.radius}%`,
                width: `${h.radius * 2}%`,
                height: `${h.radius * 2}%`,
                borderRadius: "50%",
                border: "3px solid lime",
                background: "rgba(0,255,0,0.15)",
                pointerEvents: "none",
              }}
            />
          ) : null
        )}
      </div>

      <div style={{ marginTop: 10, fontWeight: "bold" }}>
        Score: {score}
      </div>
    </div>
  );
}
