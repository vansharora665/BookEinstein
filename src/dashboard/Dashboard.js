import "./dashboard.css";
import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardHero from "./components/DashboardHero";
import StatsRow from "./components/StatsRow";
import ContinueLearning from "./components/ContinueLearning";
import RightPanel from "./components/RightPanel";

import ModulesPage from "./ModulesPage";
import ModuleDetail from "./ModuleDetail";
import TopicWorkspace from "./TopicWorkspace";
import Profile from "./components/Profile";

import { useModules } from "./hooks/useModules";
import { useProgress } from "./hooks/useProgress";
import { useLearningTimer } from "./hooks/useLearningTimer";
import Loader from "../common/Loader";


// 🔑 make available to TopicWorkspace



export default function Dashboard() {
  // 🔁 VIEW STATE
  const [activeView, setActiveView] = useState("dashboard");
  

  // 📦 LEARNING FLOW STATE
  const [activeModule, setActiveModule] = useState(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState(null);

  // 🧠 TOPIC PROGRESS STATE (NEW)
  // topicProgress[moduleId][topicIndex] = percentage
  const [topicProgressMap, setTopicProgressMap] = useState({});

  // ✅ SINGLE SOURCE OF NAVIGATION TRUTH
  function navigateTo(view) {
    setActiveView(view);
    setActiveModule(null);
    setActiveTopicIndex(null);
  }

  // ✅ ACTIVITY → TOPIC PROGRESS HANDLER (NEW)
  function handleActivityComplete(moduleId, topicIndex, totalActivities) {
    setTopicProgressMap((prev) => {
      const moduleProg = prev[moduleId] || {};
      const current = moduleProg[topicIndex] || 0;
      const increment = 100 / totalActivities;

      return {
        ...prev,
        [moduleId]: {
          ...moduleProg,
          [topicIndex]: Math.min(100, current + increment),
        },
      };
    });
  }
  function updateTopicProgress(moduleId, topicIndex, increment) {
  setTopicProgressMap((prev) => {
    const key = `${moduleId}-${topicIndex}`;
    const current = prev[key] || 0;
    const next = Math.min(100, current + increment);

    return {
      ...prev,
      [key]: next,
    };
  });
}

useEffect(() => {
  const isWorkspace = activeModule && activeTopicIndex !== null;

  if (!isWorkspace) {
    document.body.classList.remove("workspace-active");
  }
}, [activeModule, activeTopicIndex, activeView]);


window.updateTopicProgress = updateTopicProgress;

  const modules = useModules();
  const { currentModule } = useProgress(modules);
  const hours = useLearningTimer(true);

  if (!modules) {
    return <Loader text="Loading your dashboard..." />;
  }

  const isInWorkspace = activeModule && activeTopicIndex !== null;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <Sidebar navigateTo={navigateTo} />

      <main className="dashboard-main">
        {/* 🔥 HIDE TOPBAR IN WORKSPACE */}
        {!isInWorkspace && <Topbar />}

        {/* ================= DASHBOARD HOME ================= */}
        {activeView === "dashboard" && !activeModule && (
          <div className="dashboard-grid">
            <div className="dashboard-left">
              <DashboardHero />

              <StatsRow
                completed={1}
                certificates={2}
                hours={hours}
                streak={3}
              />

              <ContinueLearning
  module={currentModule}
  onSeeAll={() => navigateTo("modules")}
  onResume={() => {
    if (!currentModule) return;

    setActiveView("modules");   // ensures correct layout
    setActiveModule(currentModule);
    setActiveTopicIndex(null);  // opens topic list
  }}
/>

            </div>

            <RightPanel />
          </div>
        )}

        {/* ================= MODULES LIST ================= */}
        {activeView === "modules" && !activeModule && (
          <ModulesPage
            modules={modules}
            onSelectModule={(module) => {
              setActiveModule(module);
              setActiveTopicIndex(null);
            }}
          />
        )}

        {/* ================= PROFILE ================= */}
        {activeView === "profile" && <Profile />}

        {/* ================= MODULE DETAIL (TOPICS) ================= */}
        {activeModule && activeTopicIndex === null && (
  <ModuleDetail
    module={activeModule}
    topicProgress={Object.fromEntries(
      Object.entries(topicProgressMap)
        .filter(([k]) => k.startsWith(activeModule.id))
        .map(([k, v]) => [
          Number(k.split("-")[1]),
          v,
        ])
    )}
    onBack={() => navigateTo("modules")}
    onOpenTopic={(index) => setActiveTopicIndex(index)}
  />
)}


        {/* ================= TOPIC WORKSPACE ================= */}
        {activeModule && activeTopicIndex !== null && (
          <TopicWorkspace
            module={activeModule}
            topicIndex={activeTopicIndex}
            onExit={() => setActiveTopicIndex(null)}
            onActivityComplete={handleActivityComplete}
          />
        )}
      </main>
    </div>
  );
}
