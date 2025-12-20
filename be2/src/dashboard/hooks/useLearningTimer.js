import { useEffect, useRef, useState } from "react";

const KEY = "be_learning_hours";

export function useLearningTimer(active = true) {
  const startRef = useRef(null);
  const [hours, setHours] = useState(
    Number(localStorage.getItem(KEY)) || 0
  );

  useEffect(() => {
    if (!active) return;

    startRef.current = Date.now();

    const interval = setInterval(() => {
      const delta = (Date.now() - startRef.current) / 3600000;
      setHours((h) => {
        const updated = h + delta;
        localStorage.setItem(KEY, updated.toFixed(2));
        return updated;
      });
      startRef.current = Date.now();
    }, 60000); // every 1 min

    return () => clearInterval(interval);
  }, [active]);

  return hours;
}
