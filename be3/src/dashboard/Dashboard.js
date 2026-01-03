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

export default function Dashboard() {
  /* ===============================
     DATA HOOKS (TOP LEVEL ONLY)
  =============================== */
  const modules = useModules();
  const { currentModule } = useProgress(modules);
  const hours = useLearningTimer(true);
  

  /* ===============================
     VIEW STATE
  =============================== */
  const [activeView, setActiveView] = useState("dashboard");
  const [activeModule, setActiveModule] = useState(null);
  const [activeTopicIndex, setActiveTopicIndex] = useState(null);

  const [topicProgressMap, setTopicProgressMap] = useState({});
  
  /* ===============================
     BROWSER STATE
  =============================== */
  function pushBrowserState(state) {
    window.history.pushState(state, "", window.location.pathname);
  }

  function navigateTo(view) {
    pushBrowserState({ view });
    setActiveView(view);
    setActiveModule(null);
    setActiveTopicIndex(null);
  }

  function openModule(module) {
    pushBrowserState({ view: "modules", moduleId: module.id });
    setActiveView("modules");
    setActiveModule(module);
    setActiveTopicIndex(null);
  }

  function openTopic(index) {
    pushBrowserState({
      view: "topic",
      moduleId: activeModule.id,
      topicIndex: index,
    });
    setActiveTopicIndex(index);
  }

  function exitTopic() {
    pushBrowserState({
      view: "modules",
      moduleId: activeModule.id,
    });
    setActiveTopicIndex(null);
  }

  /* ===============================
     BACK BUTTON
  =============================== */
  useEffect(() => {
    const handler = (e) => {
      const state = e.state;

      if (!state) {
        setActiveView("dashboard");
        setActiveModule(null);
        setActiveTopicIndex(null);
        return;
      }

      setActiveView(state.view || "dashboard");

      if (state.moduleId && modules) {
        const mod = modules.find((m) => m.id === state.moduleId);
        setActiveModule(mod || null);
      } else {
        setActiveModule(null);
      }

      setActiveTopicIndex(
        state.topicIndex !== undefined ? state.topicIndex : null
      );
    };

    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [modules]);

  /* ===============================
     PROGRESS
  =============================== */
  function updateTopicProgress(moduleId, topicIndex, increment) {
    setTopicProgressMap((prev) => {
      const moduleProgress = prev[moduleId] || {};
      const current = moduleProgress[topicIndex] || 0;

      return {
        ...prev,
        [moduleId]: {
          ...moduleProgress,
          [topicIndex]: Math.min(100, current + increment),
        },
      };
    });
  }

  useEffect(() => {
    window.updateTopicProgress = updateTopicProgress;
    return () => delete window.updateTopicProgress;
  }, []);

  /* ===============================
     BODY STATE
  =============================== */
  useEffect(() => {
    const isWorkspace = activeModule && activeTopicIndex !== null;
    document.body.classList.toggle("workspace-active", isWorkspace);
    return () => document.body.classList.remove("workspace-active");
  }, [activeModule, activeTopicIndex]);
  
  /* ===============================
     LOADING
  =============================== */
  if (modules === null) {
  return <Loader text="Loading your dashboard..." />;
}


  const isInWorkspace = activeModule && activeTopicIndex !== null;

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="dashboard-layout">
<Sidebar navigateTo={navigateTo} activeView={activeView} />

      <main className="dashboard-main">
        {!isInWorkspace && <Topbar />}

        {activeView === "dashboard" && !activeModule && (
          <div className="dashboard-grid">
            <div className="dashboard-left">
              <DashboardHero />
              <StatsRow completed={1} certificates={2} hours={hours} streak={3} />
              <ContinueLearning
                module={currentModule}
                onSeeAll={() => navigateTo("modules")}
                onResume={() => currentModule && openModule(currentModule)}
              />
            </div>
            <RightPanel />
          </div>
        )}

        {activeView === "modules" && !activeModule && (
          <ModulesPage modules={modules} onSelectModule={openModule} />
        )}

        {activeView === "profile" && <Profile />}

        {activeModule && activeTopicIndex === null && (
          <ModuleDetail
            module={activeModule}
            topicProgress={topicProgressMap[activeModule.id] || {}}
            onBack={() => navigateTo("modules")}
            onOpenTopic={openTopic}
          />
        )}

        {activeModule && activeTopicIndex !== null && (
          <TopicWorkspace
            module={activeModule}
            topicIndex={activeTopicIndex}
            onExit={exitTopic}
          />
        )}
      </main>
    </div>
  );
}
