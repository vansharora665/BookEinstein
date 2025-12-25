import "./dashboard.css";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardHero from "./components/DashboardHero";
import StatsRow from "./components/StatsRow";
import ContinueLearning from "./components/ContinueLearning";
import RightPanel from "./components/RightPanel";

import ModulesPage from "./ModulesPage";
import ModuleDetail from "./ModuleDetail";
import TopicWorkspace from "./TopicWorkspace";

import { useModules } from "./hooks/useModules";
import { useProgress } from "./hooks/useProgress";
import { useLearningTimer } from "./hooks/useLearningTimer";

export default function Dashboard() {
  // 🔁 VIEW STATE
  const [activeView, setActiveView] = useState("dashboard");

  // 📦 LEARNING FLOW STATE
  const [activeModule, setActiveModule] = useState(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState(null);

  // ✅ SINGLE SOURCE OF NAVIGATION TRUTH
  function navigateTo(view) {
    setActiveView(view);
    setActiveModule(null);
    setActiveTopicIndex(null);
  }

  const modules = useModules();
  const { currentModule } = useProgress(modules);
  const hours = useLearningTimer(true);

  if (!modules) {
    return (
      <div style={{ padding: "60px", fontSize: "18px" }}>
        Loading your dashboard...
      </div>
    );
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

        {/* ================= MODULE DETAIL (TOPICS) ================= */}
        {activeModule && activeTopicIndex === null && (
          <ModuleDetail
            module={activeModule}
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
          />
        )}
      </main>
    </div>
  );
}
