import { useState, useEffect } from "react";
import "./profile.css";

const AVATARS = [
  "/profile/ai-1.jpg",
  "/profile/ai-2.jpg",
  "/profile/ai-3.jpg",
  "/profile/ai-4.jpg",
  "/profile/ai-5.jpg",
];

const SCORES = [
  { quiz: "AI Basics", score: 8, total: 10 },
  { quiz: "Machine Learning", score: 6, total: 10 },
  { quiz: "Neural Networks", score: 9, total: 10 },
];

const LEADERBOARD = [
  { name: "Aarav", score: 980 },
  { name: "Meera", score: 920 },
  { name: "You", score: 880 },
  { name: "Kabir", score: 840 },
];

export default function ProfileHub() {
  const [tab, setTab] = useState("profile");

  // ✅ PERSISTED PROFILE DATA
  const [avatar, setAvatar] = useState(
    () => localStorage.getItem("profile_avatar") || AVATARS[0]
  );
  const [firstName, setFirstName] = useState(
    () => localStorage.getItem("profile_first_name") || "Student"
  );
  const [lastName, setLastName] = useState(
    () => localStorage.getItem("profile_last_name") || "Name"
  );
  const [dob, setDob] = useState(
    () => localStorage.getItem("profile_dob") || ""
  );

  // ✅ AUTO-SAVE
  useEffect(() => {
    localStorage.setItem("profile_avatar", avatar);
  }, [avatar]);

  useEffect(() => {
    localStorage.setItem("profile_first_name", firstName);
  }, [firstName]);

  useEffect(() => {
    localStorage.setItem("profile_last_name", lastName);
  }, [lastName]);

  useEffect(() => {
    localStorage.setItem("profile_dob", dob);
  }, [dob]);

  return (
    <div className="profile-hub">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-avatar-large">
          <img src={avatar} alt="avatar" />
        </div>
        <div>
          <h1>
            {firstName} {lastName}
          </h1>
          <p>AI Learning Journey</p>
        </div>
      </div>

      {/* TABS */}
      <div className="hub-tabs">
        {["profile", "scores", "leaderboard"].map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ================= PROFILE ================= */}
      {tab === "profile" && (
        <>
          {/* AVATAR */}
          <div className="card gradient-card">
            <h3>Choose your AI Avatar</h3>
            <div className="avatar-row">
              {AVATARS.map((a) => (
                <div
                  key={a}
                  className={`avatar-wrap ${avatar === a ? "active" : ""}`}
                  onClick={() => setAvatar(a)}
                >
                  <img src={a} alt="avatar" />
                </div>
              ))}
            </div>
          </div>

          {/* PERSONAL INFO */}
          <div className="card">
            <h3>Personal Information</h3>

            <div className="profile-form-row">
              <label>
                First Name
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              <label>
                Last Name
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>

              <label>
                Date of Birth
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </label>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-row">
            <div className="stat highlight">
              <strong>12</strong>
              <span>Quizzes</span>
            </div>
            <div className="stat">
              <strong>86%</strong>
              <span>Avg Score</span>
            </div>
            <div className="stat">
              <strong>7</strong>
              <span>Day Streak</span>
            </div>
          </div>
        </>
      )}

      {/* ================= SCORES ================= */}
      {tab === "scores" && (
        <div className="card">
          <h3>Quiz Performance</h3>

          <div className="score-list">
            {SCORES.map((s, i) => {
              const percent = Math.round((s.score / s.total) * 100);
              return (
                <div key={i} className="score-item">
                  <div>
                    <strong>{s.quiz}</strong>
                    <p>
                      {s.score} / {s.total}
                    </p>
                  </div>

                  <div className="score-right">
                    <div className="progress-bar">
                      <div style={{ width: `${percent}%` }} />
                    </div>
                    <span className={`pill ${percent >= 70 ? "good" : "bad"}`}>
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= LEADERBOARD ================= */}
      {tab === "leaderboard" && (
        <div className="card">
          <h3>Leaderboard</h3>

          <div className="leaderboard">
            {LEADERBOARD.map((u, i) => (
              <div
                key={i}
                className={`leader-row ${u.name === "You" ? "me" : ""}`}
              >
                <span className={`rank r-${i + 1}`}>{i + 1}</span>
                <span>{u.name}</span>
                <span className="points">{u.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
