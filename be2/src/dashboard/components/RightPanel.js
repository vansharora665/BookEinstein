import FireCard from "./FireCard";
import LearningHours from "./LearningHours";
import Leaderboard from "./Leaderboard";
import "./rightPanel.css";

export default function RightPanel() {
  return (
    <aside className="right-panel">
      <FireCard />
      <LearningHours />
      <Leaderboard />
    </aside>
  );
}
