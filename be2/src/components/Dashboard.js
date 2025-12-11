import React, { useState } from "react";

const avatarOptions = [
  { id: "robot", emoji: "🤖", label: "Robot" },
  { id: "owl", emoji: "🦉", label: "Owl" },
  { id: "nerd", emoji: "🤓", label: "Nerd" },
  { id: "rocket", emoji: "🚀", label: "Rocket" },
  {
    id: "avatar-boy",
    label: "Coder Boy",
    image:
      "https://images.pexels.com/photos/4144095/pexels-photo-4144095.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "avatar-girl",
    label: "Creator Girl",
    image:
      "https://images.pexels.com/photos/4148860/pexels-photo-4148860.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
];

function Dashboard({
  fullModules,
  selectedModule,
  setSelectedModule,
  progress,
  leaderboard,
  leaderboardFilter,
  setLeaderboardFilter,
  onCompleteTopic,
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].id);
  const [customAvatarUrl, setCustomAvatarUrl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // page: 'dashboard' | 'modules' | 'leaderboard' | 'community' | 'help' | 'learning' | 'activity'
  const [activePage, setActivePage] = useState("dashboard");

  const [learningModule, setLearningModule] = useState(null);
  const [activityModule, setActivityModule] = useState(null);
  const [activityTopicIndex, setActivityTopicIndex] = useState(0);

  const maxPoints =
    leaderboard.length > 0
      ? Math.max(...leaderboard.map((s) => s.points))
      : 1;

  const completionForModule = (moduleId) => {
    const arr = progress[moduleId] || [];
    const done = arr.filter(Boolean).length;
    return { done, total: arr.length };
  };

  const totalTopics = fullModules.reduce((sum, m) => sum + m.topics.length, 0);
  const totalDone = fullModules.reduce((sum, m) => {
    const { done } = completionForModule(m.id);
    return sum + done;
  }, 0);
  const overallPercent = totalTopics
    ? Math.round((totalDone / totalTopics) * 100)
    : 0;

  const modulesCompleted = fullModules.filter((m) => {
    const { done, total } = completionForModule(m.id);
    return total > 0 && done === total;
  }).length;

  const currentAvatar =
    selectedAvatar === "custom"
      ? { id: "custom", label: "Custom avatar", image: customAvatarUrl }
      : avatarOptions.find((a) => a.id === selectedAvatar) || avatarOptions[0];

  const handleAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomAvatarUrl(url);
    setSelectedAvatar("custom");
  };

  const goToDashboard = () => {
    setActivePage("dashboard");
    setLearningModule(null);
    setActivityModule(null);
  };

  const openModuleLearning = (mod) => {
    setLearningModule(mod);
    setActivePage("learning");
  };

  const openActivity = (mod, topicIndex) => {
    setActivityModule(mod);
    setActivityTopicIndex(topicIndex);
    setActivePage("activity");
  };

  return (
    <main className="dashboard">
      <div className="dashboard-shell">
        {/* LEFT SIDEBAR */}
        {sidebarOpen && (
          <aside className="dashboard-sidebar">
            <div className="sidebar-logo-pill">
              <span className="sidebar-logo-icon">🎓</span>
            </div>

            <nav className="dashboard-sidebar-nav">
              <SidebarItem
                label="Dashboard"
                active={activePage === "dashboard"}
                onClick={goToDashboard}
              />
              <SidebarItem
                label="My modules"
                active={activePage === "modules"}
                onClick={() => {
                  setActivePage("modules");
                  setLearningModule(null);
                  setActivityModule(null);
                }}
              />
              <SidebarItem
                label="Leaderboard"
                active={activePage === "leaderboard"}
                onClick={() => {
                  setActivePage("leaderboard");
                  setLearningModule(null);
                  setActivityModule(null);
                }}
              />
              <SidebarItem
                label="Community"
                active={activePage === "community"}
                onClick={() => {
                  setActivePage("community");
                  setLearningModule(null);
                  setActivityModule(null);
                }}
              />
              <SidebarItem
                label="Help & support"
                active={activePage === "help"}
                onClick={() => {
                  setActivePage("help");
                  setLearningModule(null);
                  setActivityModule(null);
                }}
              />
            </nav>

            <button className="sidebar-logout">Logout</button>
          </aside>
        )}

        {/* MAIN CONTENT */}
        <div className="dashboard-content">
          {/* menu button */}
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <span className="sidebar-toggle-icon">☰</span>
            <span className="sidebar-toggle-text">
              {sidebarOpen ? "Close menu" : "Menu"}
            </span>
          </button>

          {/* PAGE SWITCHING */}
          {activePage === "dashboard" && (
            <DashboardHome
              avatarOptions={avatarOptions}
              currentAvatar={currentAvatar}
              setSelectedAvatar={setSelectedAvatar}
              handleAvatarUpload={handleAvatarUpload}
              modulesCompleted={modulesCompleted}
              fullModules={fullModules}
              totalDone={totalDone}
              totalTopics={totalTopics}
              overallPercent={overallPercent}
              completionForModule={completionForModule}
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
              onStartModule={openModuleLearning}
              leaderboard={leaderboard}
              leaderboardFilter={leaderboardFilter}
              setLeaderboardFilter={setLeaderboardFilter}
              maxPoints={maxPoints}
            />
          )}

          {activePage === "modules" && (
            <MyModulesPage
              fullModules={fullModules}
              completionForModule={completionForModule}
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
              onStartModule={openModuleLearning}
            />
          )}

          {activePage === "leaderboard" && (
            <LeaderboardPage
              leaderboard={leaderboard}
              leaderboardFilter={leaderboardFilter}
              setLeaderboardFilter={setLeaderboardFilter}
              maxPoints={maxPoints}
            />
          )}

          {activePage === "community" && <CommunityPage />}

          {activePage === "help" && <HelpPage />}

          {activePage === "learning" && learningModule && (
            <ModuleLearningView
              module={learningModule}
              progress={progress}
              onCompleteTopic={onCompleteTopic}
              onBack={() => {
                setActivePage("modules");
                setActivityModule(null);
              }}
              onOpenActivity={(topicIndex) =>
                openActivity(learningModule, topicIndex)
              }
            />
          )}

          {activePage === "activity" && activityModule && (
            <ActivityWorkspace
              module={activityModule}
              topicIndex={activityTopicIndex}
              onBack={() => setActivePage("learning")}
            />
          )}
        </div>
      </div>
    </main>
  );
}

/* ---------- Sidebar button ---------- */

function SidebarItem({ label, active, onClick }) {
  return (
    <button
      type="button"
      className={`dashboard-sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="sidebar-dot" />
      <span>{label}</span>
    </button>
  );
}

/* ---------- Dashboard home page ---------- */

function DashboardHome({
  avatarOptions,
  currentAvatar,
  setSelectedAvatar,
  handleAvatarUpload,
  modulesCompleted,
  fullModules,
  totalDone,
  totalTopics,
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
  return (
    <>
      {/* Hero welcome card */}
      <section className="dashboard-hero-card">
        <div className="hero-card-left">
          <p className="hero-card-date">Today</p>
          <h1 className="hero-card-title">
            Welcome back, Einstein in training 👋
          </h1>
          <p className="hero-card-subtitle">
            Keep exploring AI concepts, earn XP, and build projects you can
            showcase in college applications.
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
        </div>

        {/* Avatar panel */}
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
                    currentAvatar.id === a.id ? "active" : ""
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

      {/* Summary row */}
      <section className="dashboard-summary-row">
        <SummaryCard
          title="Active modules"
          value={`${fullModules.length - modulesCompleted}`}
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

      {/* Modules + leaderboard */}
      <section className="dashboard-main-two-column">
        <MyModulesPanel
          fullModules={fullModules}
          completionForModule={completionForModule}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          onStartModule={onStartModule}
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

/* ---------- My modules page + panel ---------- */

function MyModulesPanel({
  fullModules,
  completionForModule,
  selectedModule,
  setSelectedModule,
  onStartModule,
}) {
  return (
    <div className="modules-column dashboard-modules-panel">
      <div className="section-header inline">
        <h2>Your AI modules</h2>
        <span className="pill">5 modules • 25 topics</span>
      </div>
      <div className="full-modules-grid">
        {fullModules.map((mod) => {
          const { done, total } = completionForModule(mod.id);
          const percent = total ? Math.round((done / total) * 100) : 0;
          return (
            <div
              key={mod.id}
              className={`full-module-card ${mod.color} ${
                selectedModule.id === mod.id ? "active" : ""
              }`}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedModule(mod)}
            >
              <h3>{mod.title}</h3>
              <p>{mod.level}</p>
              <span className="module-progress">
                {done}/{total} topics • {percent}%
              </span>
              <div className="module-progress-bar">
                <div
                  className="module-progress-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="module-desc">
                Guided lessons, visual explanations, and bite-sized quizzes to
                build your AI intuition.
              </p>
              <div className="module-card-actions">
                <button
                  type="button"
                  className="module-secondary-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedModule(mod);
                  }}
                >
                  View topics
                </button>
                <button
                  type="button"
                  className="module-primary-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartModule(mod);
                  }}
                >
                  Start
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MyModulesPage(props) {
  return (
    <section className="page-section">
      <div className="page-header">
        <h1>My modules</h1>
        <p>
          Track all AI modules you’re enrolled in. Start from the basics, then
          move into machine learning, ethics, and your first hands-on project.
        </p>
      </div>
      <MyModulesPanel {...props} />
    </section>
  );
}

/* ---------- Leaderboard (panel + full page) ---------- */

function LeaderboardPanel({
  leaderboard,
  leaderboardFilter,
  setLeaderboardFilter,
  maxPoints,
}) {
  return (
    <section className="leaderboard-section dashboard-leaderboard-panel">
      <div className="section-header inline">
        <h2>Community leaderboard</h2>
        <span className="pill">Finish topics to climb up</span>
      </div>

      <div className="leaderboard-controls">
        <div className="toggle-group">
          <button
            className={`toggle-btn ${
              leaderboardFilter === "all" ? "active" : ""
            }`}
            onClick={() => setLeaderboardFilter("all")}
          >
            All classes
          </button>
          <button
            className={`toggle-btn ${
              leaderboardFilter === "9-10" ? "active" : ""
            }`}
            onClick={() => setLeaderboardFilter("9-10")}
          >
            Class 9–10
          </button>
          <button
            className={`toggle-btn ${
              leaderboardFilter === "11-12" ? "active" : ""
            }`}
            onClick={() => setLeaderboardFilter("11-12")}
          >
            Class 11–12
          </button>
        </div>
        <span className="leaderboard-hint">
          Each completed topic gives you +30 XP and reshuffles the board.
        </span>
      </div>

      <div className="leaderboard-bars">
        {leaderboard.map((s, index) => (
          <div key={s.id} className="leader-row">
            <div className="leader-info">
              <span className="leader-rank">#{index + 1}</span>
              <div className="leader-name-block">
                <p className={`leader-name ${s.id === "you" ? "you" : ""}`}>
                  {s.name}
                </p>
                <p className="leader-meta">
                  {s.grade} • {s.school}
                </p>
              </div>
              <span className="leader-points">{s.points} XP</span>
            </div>
            <div className="leader-bar-wrap">
              <div
                className="leader-bar-fill"
                style={{ width: `${(s.points / maxPoints) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

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

/* ---------- Community page ---------- */

function CommunityPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Community</h1>
        <p>
          Join other learners, share your AI projects, and participate in
          monthly challenges curated by mentors.
        </p>
      </div>

      <div className="page-grid">
        <div className="community-card">
          <h3>Discussion rooms</h3>
          <p>
            Ask questions, share ideas, and get help from peers learning the
            same topics. Separate rooms for Class 9–10 and Class 11–12.
          </p>
          <ul>
            <li>#intro-to-ai – beginners ask anything</li>
            <li>#projects – showcase your builds</li>
            <li>#doubts – quick conceptual questions</li>
          </ul>
          <button className="module-primary-btn">Open discussions</button>
        </div>

        <div className="community-card">
          <h3>Monthly AI challenges</h3>
          <p>
            Work on a themed project every month – from chatbots to image
            classifiers – and climb a separate challenge leaderboard.
          </p>
          <ul>
            <li>Guided prompts &amp; starter datasets</li>
            <li>Peer feedback and mentor comments</li>
            <li>Digital certificates for top performers</li>
          </ul>
          <button className="module-secondary-btn">View this month’s brief</button>
        </div>

        <div className="community-card">
          <h3>Mentor sessions</h3>
          <p>
            Attend live Q&amp;A with AI engineers and researchers to understand
            how AI is used in real companies and research labs.
          </p>
          <ul>
            <li>Career guidance and college tips</li>
            <li>Demo of real ML tools and platforms</li>
            <li>Short recorded recaps for revision</li>
          </ul>
          <button className="module-secondary-btn">Upcoming sessions</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Help & support page ---------- */

function HelpPage() {
  return (
    <section className="page-section">
      <div className="page-header">
        <h1>Help &amp; support</h1>
        <p>
          Stuck somewhere? Explore quick guides, FAQs, and ways to contact our
          support team or your school coordinator.
        </p>
      </div>

      <div className="page-grid">
        <div className="help-card">
          <h3>Getting started guide</h3>
          <p>
            Learn how to navigate modules, complete activities, and track your
            progress across devices.
          </p>
          <ul>
            <li>How to choose your first module</li>
            <li>How XP and badges are calculated</li>
            <li>Device and browser recommendations</li>
          </ul>
          <button className="module-primary-btn">Open guide</button>
        </div>

        <div className="help-card">
          <h3>Frequently asked questions</h3>
          <p>
            Find answers about accounts, progress reset, certificates, and
            parental access to reports.
          </p>
          <ul>
            <li>How do I reset a module?</li>
            <li>Can my parents see my progress?</li>
            <li>What if I miss a live session?</li>
          </ul>
          <button className="module-secondary-btn">View FAQs</button>
        </div>

        <div className="help-card">
          <h3>Contact support</h3>
          <p>
            Reach out for technical issues or content doubts that teachers
            cannot resolve directly.
          </p>
          <ul>
            <li>Email: support@bookeinstein.ai</li>
            <li>Response within 24 hours on school days</li>
            <li>Emergency chat during live exams &amp; contests</li>
          </ul>
          <button className="module-secondary-btn">Send a message</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Summary card ---------- */

function SummaryCard({ title, value, sub, highlight }) {
  return (
    <div className={`summary-card ${highlight ? "highlight" : ""}`}>
      <p className="summary-title">{title}</p>
      <p className="summary-value">{value}</p>
      <p className="summary-sub">{sub}</p>
    </div>
  );
}

/* ---------- Learning view (module page) ---------- */

function ModuleLearningView({
  module,
  progress,
  onCompleteTopic,
  onBack,
  onOpenActivity,
}) {
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const topics = module.topics;
  const moduleProgress = progress[module.id] || [];
  const isTopicDone = (i) => !!moduleProgress[i];

  return (
    <section className="module-learning">
      {/* LEFT: topic list */}
      <aside className="module-learning-sidebar">
        <div className="module-learning-header">
          <h2>{module.title}</h2>
          <p className="module-learning-sub">
            Choose a sub-topic on the left and use the activity workspace to
            explore it with videos, quizzes, or mini-games.
          </p>
        </div>
        <ul className="learning-topic-list">
          {topics.map((topic, i) => (
            <li
              key={topic}
              className={`learning-topic-item ${
                activeTopicIndex === i ? "active" : ""
              } ${isTopicDone(i) ? "done" : ""}`}
              onClick={() => setActiveTopicIndex(i)}
            >
              <div className="learning-topic-main">
                <span className="learning-topic-badge">{i + 1}</span>
                <div>
                  <p className="learning-topic-title">{topic}</p>
                  <p className="learning-topic-caption">
                    {isTopicDone(i) ? "Completed" : "Tap to learn"}
                  </p>
                </div>
              </div>
              {isTopicDone(i) && (
                <span className="learning-topic-check">✔</span>
              )}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="module-secondary-btn full-width"
          onClick={onBack}
        >
          ← Back to modules
        </button>
      </aside>

      {/* CENTER: explanation + activity controls */}
      <div className="module-learning-content">
        <div className="learning-content-header">
          <h3>{topics[activeTopicIndex]}</h3>
          <span className="learning-content-pill">Topic overview</span>
        </div>

        <div className="learning-content-body">
          <div className="learning-content-main-card">
            <p className="learning-content-text">
              This section gives a short, classroom-style explanation of the
              topic. Use examples, diagrams, and analogies from everyday school
              life so the concept sticks.
            </p>
            <ul className="learning-content-list">
              <li>Key idea of the topic in 3–4 sentences.</li>
              <li>
                A simple real-world example (for example, AI recommending songs
                you might like).
              </li>
              <li>
                A mini challenge to think about before entering the activity
                workspace.
              </li>
            </ul>
          </div>

          <div className="learning-content-actions">
            <button
              type="button"
              className="module-secondary-btn"
              onClick={() =>
                alert(
                  "Here you can plug in a small practice question or embed a quiz widget."
                )
              }
            >
              Quick practice
            </button>
            <button
              type="button"
              className="module-primary-btn"
              onClick={() => onOpenActivity(activeTopicIndex)}
            >
              Start activity workspace
            </button>
            <button
              type="button"
              className="module-primary-btn"
              onClick={() => onCompleteTopic(module.id, activeTopicIndex)}
            >
              Mark as completed
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Full-page Activity workspace ---------- */

function ActivityWorkspace({ module, topicIndex, onBack }) {
  const topicTitle = module.topics[topicIndex];

  return (
    <section className="activity-workspace">
      <div className="activity-header">
        <div>
          <p className="activity-breadcrumb">
            {module.title} • Topic {topicIndex + 1}
          </p>
          <h1>{topicTitle}</h1>
          <p>
            This is your dedicated activity space. Embed videos, simulations,
            code sandboxes, or quiz components here for an immersive experience.
          </p>
        </div>
        <button
          type="button"
          className="module-secondary-btn"
          onClick={onBack}
        >
          ← Back to topic overview
        </button>
      </div>

      <div className="activity-main">
        <div className="activity-primary">
          <div className="activity-media-card">
            <p className="activity-label">Activity canvas</p>
            <p>
              Imagine a video player, drag-and-drop game, or interactive quiz in
              this area. For now, this is a placeholder panel styled like your
              other cards.
            </p>
            <ul>
              <li>Play an explainer video for this topic.</li>
              <li>Show interactive steps or coding blocks.</li>
              <li>End with 3–5 auto-graded questions.</li>
            </ul>
          </div>
        </div>

        <aside className="activity-sidebar">
          <div className="activity-meta-card">
            <h3>Activity outline</h3>
            <ol>
              <li>Warm-up question to recall basics.</li>
              <li>Watch / interact with the main activity.</li>
              <li>Answer reflection question or short quiz.</li>
            </ol>
          </div>

          <div className="activity-meta-card">
            <h3>Teacher notes</h3>
            <p>
              Teachers can add hints, tips, or follow-up tasks for homework.
              These instructions stay hidden from the main student flow if
              required.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Dashboard;
