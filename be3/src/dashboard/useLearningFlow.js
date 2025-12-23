import { useState } from "react";

export function useLearningFlow() {
  const [activeModule, setActiveModule] = useState(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState(null);

  return {
    activeModule,
    setActiveModule,
    activeTopicIndex,
    setActiveTopicIndex,
  };
}
