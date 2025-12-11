import React, { useState } from "react";
import "./App.css";

import { basicModules, fullModules, heroTiles, baseLeaderboard } from "./data/content";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // topic completion: progress[moduleId] = [bool, bool, ...]
  const [progress, setProgress] = useState(() => {
    const initial = {};
    fullModules.forEach((m) => {
      initial[m.id] = Array(m.topics.length).fill(false);
    });
    return initial;
  });

  const [selectedModule, setSelectedModule] = useState(fullModules[0]);
  const [leaderboard, setLeaderboard] = useState(
    [...baseLeaderboard].sort((a, b) => b.points - a.points)
  );
  const [leaderboardFilter, setLeaderboardFilter] = useState("all");

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const toggleAuth = () => setIsSignedIn((prev) => !prev);

  const handleCompleteTopic = (moduleId, topicIndex) => {
    const already = progress[moduleId][topicIndex];
    if (already) return;

    setProgress((prev) => {
      const updatedModule = [...prev[moduleId]];
      updatedModule[topicIndex] = true;
      return { ...prev, [moduleId]: updatedModule };
    });

    const XP_PER_TOPIC = 30;
    setLeaderboard((prev) =>
      prev
        .map((s) =>
          s.id === "you" ? { ...s, points: s.points + XP_PER_TOPIC } : s
        )
        .sort((a, b) => b.points - a.points)
    );
  };

  const filteredLeaderboard =
    leaderboardFilter === "all"
      ? leaderboard
      : leaderboard.filter((s) =>
          leaderboardFilter === "9-10"
            ? ["Class 9", "Class 10"].includes(s.grade)
            : ["Class 11", "Class 12"].includes(s.grade)
        );

  return (
    <div className={`app ${isDarkMode ? "dark-theme" : "light-theme"}`}>
      <Header
        isSignedIn={isSignedIn}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onToggleAuth={toggleAuth}
      />

      {!isSignedIn ? (
        <LandingPage heroTiles={heroTiles} basicModules={basicModules} />
      ) : (
        <Dashboard
          fullModules={fullModules}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          progress={progress}
          leaderboard={filteredLeaderboard}
          leaderboardFilter={leaderboardFilter}
          setLeaderboardFilter={setLeaderboardFilter}
          onCompleteTopic={handleCompleteTopic}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
