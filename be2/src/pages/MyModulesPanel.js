// src/components/MyModulesPanel.js
import React from "react";

function MyModulesPanel({
  fullModules,
  completionForModule,
  selectedModule,
  setSelectedModule,
  onStartModule,
  modulesCompleted = 0,
}) {
  return (
    <div className="modules-column dashboard-modules-panel">
      <div className="section-header inline">
        <h2>Your AI modules</h2>
        <span className="pill">{fullModules.length} modules • {fullModules.reduce((s,m)=>s+m.topics.length,0)} topics</span>
      </div>

      <div className="full-modules-grid">
        {fullModules.map((mod, idx) => {
          const { done, total } = completionForModule(mod.id);
          const percent = total ? Math.round((done / total) * 100) : 0;

          // unlocked if it's one of the first two OR modulesCompleted >= 1
          const unlocked = idx < 2 || (typeof modulesCompleted === "number" && modulesCompleted >= 1);

          const isActive = selectedModule && selectedModule.id === mod.id;

          return (
            <div
              key={mod.id}
              className={`full-module-card ${mod.color || ""} ${isActive ? "active" : ""} ${!unlocked ? "locked" : ""}`}
              role="button"
              tabIndex={unlocked ? 0 : -1}
              onClick={() => { if (!unlocked) return; setSelectedModule(mod); }}
              onKeyDown={(e) => { if (!unlocked) return; if (e.key === "Enter" || e.key === " ") setSelectedModule(mod); }}
              aria-disabled={!unlocked}
              style={{ position: "relative", overflow: "hidden" }}
            >
              {/* module image banner (if available) */}
              {mod.image ? (
                <div style={{ height: 120, width: "100%", overflow: "hidden", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                  <img
                    src={mod.image}
                    alt={mod.title}
                    style={{ width: "100%", height: "120px", objectFit: "cover", display: "block" }}
                  />
                </div>
              ) : (
                <div style={{ height: 40 }} />
              )}

              <div style={{ padding: "12px 10px 16px" }}>
                <h3 style={{ margin: 0 }}>{mod.title}</h3>
                <p style={{ margin: "6px 0", fontSize: 13, color: "var(--text-muted)" }}>{mod.level} • {mod.desc || ""}</p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <span className="module-progress" style={{ fontSize: 12 }}>
                      {done}/{total} topics • {percent}%
                    </span>
                    <div className="module-progress-bar" style={{ marginTop: 8 }}>
                      <div className="module-progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="module-secondary-btn"
                      onClick={(e) => { e.stopPropagation(); if (!unlocked) return; setSelectedModule(mod); }}
                      disabled={!unlocked}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="module-primary-btn"
                      onClick={(e) => { e.stopPropagation(); if (!unlocked) return; onStartModule(mod); }}
                      disabled={!unlocked}
                    >
                      Start
                    </button>
                  </div>
                </div>

                {mod.desc && <p style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>{mod.desc}</p>}
              </div>

              {/* lock overlay */}
              {!unlocked && (
                <div className="module-lock-overlay" aria-hidden="true" style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(180deg, rgba(2,6,23,0.28), rgba(2,6,23,0.36))",
                  color: "#fff", fontSize: 28
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28 }}>🔒</div>
                    <div style={{ fontSize: 12, marginTop: 6 }}>Locked — complete earlier modules to unlock</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyModulesPanel;
