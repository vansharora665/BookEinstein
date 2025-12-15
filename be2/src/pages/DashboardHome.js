import React from "react";
import MyModulesPanel from "./MyModulesPanel";
import LeaderboardPanel from "./LeaderboardPanel";
import SummaryCard from "./SummaryCard";

function DashboardHome({
  avatarOptions = [],
  currentAvatar,
  setSelectedAvatar,
  handleAvatarUpload,
  modulesCompleted,
  fullModules = [],
  totalDone,
  totalTopics = 0,
  overallPercent,
  completionForModule,
  selectedModule,
  setSelectedModule,
  onStartModule,
  leaderboard,
  leaderboardFilter,
  setLeaderboardFilter,
  maxPoints,
}) {
  const activeModules = fullModules.length - modulesCompleted;

  return (
    <>
      {/* HERO CARD */}
      <section className="dashboard-hero-card">
        <div className="hero-card-left">
          <p className="hero-card-date">Today</p>

          {/* course count line */}
          <p className="hero-card-course-count">
            {fullModules.length} modules • {totalTopics} topics
          </p>

          <h1 className="hero-card-title">
            Welcome back, Einstein in training 👋
          </h1>
          {/* show first module description if available, otherwise empty */}
          <p className="hero-card-subtitle">
            {fullModules && fullModules[0] && fullModules[0].desc ? fullModules[0].desc : ""}
          </p>

          <div className="hero-card-progress-row">
            <div>
              <p className="hero-card-label">Modules completed</p>
              <p className="hero-card-value">
                {modulesCompleted}/{fullModules.length}
              </p>
            </div>
            <div>
              <p className="hero-card-label">Topics completed</p>
              <p className="hero-card-value">
                {totalDone}/{totalTopics}
              </p>
            </div>
            <div className="hero-card-overall">
              <p className="hero-card-label">Overall progress</p>
              <div className="hero-card-bar">
                <div
                  className="hero-card-bar-fill"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
              <span className="hero-card-percent">
                {overallPercent}% complete
              </span>
            </div>
          </div>

          {/* NEW: numbers that used to be in the white cards, now also in hero */}
          <div className="hero-card-mini-stats">
            <div className="hero-mini-pill">
              <span className="hero-mini-label">Active modules</span>
              <span className="hero-mini-value">{activeModules}</span>
            </div>
            <div className="hero-mini-pill">
              <span className="hero-mini-label">Completed modules</span>
              <span className="hero-mini-value">{modulesCompleted}</span>
            </div>
            <div className="hero-mini-pill">
              <span className="hero-mini-label">XP earned</span>
              <span className="hero-mini-value">850+</span>
            </div>
          </div>
        </div>

        {/* AVATAR PANEL */}
        <div className="hero-card-avatar-panel">
          <div className="hero-avatar-main">
            <div className="hero-avatar-circle">
              {currentAvatar?.image ? (
                <img
                  src={currentAvatar.image}
                  alt={currentAvatar.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <span
                  role="img"
                  aria-label={currentAvatar?.label || "Avatar"}
                >
                  {currentAvatar?.emoji}
                </span>
              )}
            </div>
            <div className="hero-avatar-text">
              <p className="hero-avatar-name">You</p>
              <p className="hero-avatar-meta">Class 11 • AI Explorer</p>
            </div>
          </div>

          <div className="hero-avatar-options">
            <p className="hero-avatar-label">Choose avatar</p>
            <div className="hero-avatar-option-row">
              {avatarOptions.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`hero-avatar-chip ${
                    currentAvatar?.id === a.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedAvatar(a.id)}
                >
                  <span className="hero-avatar-chip-icon">
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.label}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span role="img" aria-label={a.label}>
                        {a.emoji}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="hero-avatar-upload">
              <label htmlFor="avatar-upload">Upload your own avatar</label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SUMMARY CARDS – kept as they are */}
      <section className="dashboard-summary-row">
        <SummaryCard
          title="Active modules"
          value={`${activeModules}`}
          sub="In progress"
        />
        <SummaryCard
          title="Completed modules"
          value={modulesCompleted}
          sub="Great job!"
          highlight
        />
        <SummaryCard
          title="XP earned"
          value="850+"
          sub="From quizzes & tasks"
        />
      </section>

      {/* MODULES + LEADERBOARD */}
      <section className="dashboard-main-two-column">
        <MyModulesPanel
          fullModules={fullModules.slice(0,5)}
          completionForModule={completionForModule}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          onStartModule={onStartModule}
          modulesCompleted={modulesCompleted}
        />
        <LeaderboardPanel
          leaderboard={leaderboard}
          leaderboardFilter={leaderboardFilter}
          setLeaderboardFilter={setLeaderboardFilter}
          maxPoints={maxPoints}
        />
      </section>
    </>
  );
}
console.log("DEBUG PAGE COMPONENTS", {
  MyModulesPanel,
  LeaderboardPanel,
});


export default DashboardHome;
