import React from "react";
import LeaderboardPanel from "./LeaderboardPanel";

function LeaderboardPage(props) {
  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Leaderboard</h1>
        <p>
          Compete with students from other schools. Earn XP by completing
          topics, solving challenges, and finishing AI projects.
        </p>
      </div>
      <LeaderboardPanel {...props} />
    </section>
  );
}

export default LeaderboardPage;
