import React, { useState, useEffect } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";

// removed sample modules import — we will only use sheet-driven modules
import { heroTiles, baseLeaderboard } from "./data/content";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";

import { useLoadModulesFromSheet } from "./hooks/useLoadModulesFromSheet";
import { SHEET_CSV_URL } from "./config";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isAuthenticated, isLoading } = useAuth0();

  // load modules from Google Sheets (single source of truth)
  const {
    modules: sheetModules,
    loading: sheetLoading,
    error: sheetError,
    refresh: refreshSheet,
  } = useLoadModulesFromSheet(SHEET_CSV_URL);

  // effective modules used across app (sheetModules OR empty array)
  const effectiveFullModules = Array.isArray(sheetModules) ? sheetModules : [];

  // topic completion: progress[moduleId] = [bool, bool, ...]
  // start empty and populate when modules arrive
  const [progress, setProgress] = useState({});

  // ensure progress shape matches loaded modules (runs when modules change)
  useEffect(() => {
    if (!effectiveFullModules || !effectiveFullModules.length) return;

    setProgress((prev) => {
      const updated = { ...prev };
      effectiveFullModules.forEach((m) => {
        const topicsLen = Array.isArray(m.topics) ? m.topics.length : 0;
        if (!updated[m.id]) {
          updated[m.id] = Array(topicsLen).fill(false);
        } else if (updated[m.id].length < topicsLen) {
          // if new topics were added, expand array preserving truthy values
          const arr = [...updated[m.id]];
          arr.length = topicsLen;
          for (let i = 0; i < arr.length; i++) {
            arr[i] = !!arr[i];
          }
          updated[m.id] = arr;
        }
      });
      return updated;
    });
  }, [effectiveFullModules]);

  // selected module — default to first sheet module when available
  const [selectedModule, setSelectedModule] = useState(null);
  useEffect(() => {
    if (effectiveFullModules && effectiveFullModules.length) {
      // avoid flipping if already set to same id
      if (!selectedModule || selectedModule.id !== effectiveFullModules[0].id) {
        setSelectedModule(effectiveFullModules[0]);
      }
    } else {
      setSelectedModule(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveFullModules]);

  const [leaderboard, setLeaderboard] = useState(
    [...baseLeaderboard].sort((a, b) => b.points - a.points)
  );
  const [leaderboardFilter, setLeaderboardFilter] = useState("all");

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleCompleteTopic = (moduleId, topicIndex) => {
    const moduleProgress = progress[moduleId];
    // guard: if module progress isn't present yet, initialize it from effective modules
    if (!moduleProgress) {
      const moduleDef = effectiveFullModules.find((m) => m.id === moduleId);
      const topicsLen = (moduleDef && Array.isArray(moduleDef.topics)) ? moduleDef.topics.length : 0;
      setProgress((prev) => ({ ...prev, [moduleId]: Array(topicsLen).fill(false) }));
    }

    const already = (progress[moduleId] && progress[moduleId][topicIndex]) || false;
    if (already) return;

    setProgress((prev) => {
      const moduleDef = effectiveFullModules.find((m) => m.id === moduleId);
      const topicsLen = (moduleDef && Array.isArray(moduleDef.topics)) ? moduleDef.topics.length : 0;
      const updatedModule =
        prev[moduleId] && prev[moduleId].length
          ? [...prev[moduleId]]
          : Array(topicsLen).fill(false);

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
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}

      />

      {isLoading ? (
  <div style={{ padding: 40 }}>Loading...</div>
) : !isAuthenticated ? (
  <LandingPage heroTiles={heroTiles} basicModules={[]} />
) : (
  <Dashboard
    fullModules={effectiveFullModules}
    selectedModule={selectedModule}
    setSelectedModule={setSelectedModule}
    progress={progress}
    leaderboard={filteredLeaderboard}
    leaderboardFilter={leaderboardFilter}
    setLeaderboardFilter={setLeaderboardFilter}
    onCompleteTopic={handleCompleteTopic}
    refreshSheet={refreshSheet}
    sheetLoading={sheetLoading}
    sheetError={sheetError}
  />
)}


      <Footer />
    </div>
  );
}

export default App;
