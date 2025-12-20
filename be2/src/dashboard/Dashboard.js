import "./dashboard.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardHero from "./components/DashboardHero";
import StatsRow from "./components/StatsRow";
import ContinueLearning from "./components/ContinueLearning";
import RightPanel from "./components/RightPanel";


import { useModules } from "./hooks/useModules";
import { useProgress } from "./hooks/useProgress";
import { useLearningTimer } from "./hooks/useLearningTimer";

export default function Dashboard() {
  const modules = useModules();
  const { currentModule } = useProgress(modules);
  const hours = useLearningTimer(true);

  if (!currentModule) return (
    <div style={{ padding: "60px", fontSize: "18px" }}>
      Loading your dashboard...
    </div>
  );

  return (
  <div className="dashboard-layout">
    <Sidebar />

    <main className="dashboard-main">
      <Topbar />

      {/* 🔑 GRID STARTS HERE */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="dashboard-left">
          <DashboardHero />

          <StatsRow
            completed={1}
            certificates={2}
            hours={hours}
            streak={3}
          />

          <ContinueLearning module={currentModule} />
        </div>

        {/* RIGHT COLUMN */}
        <RightPanel />
      </div>
    </main>
  </div>
);
console.log("MODULES:", modules);

}
