import "./topbar.css";

export default function Topbar() {
  return (
    <div className="topbar">
      {/* Search */}
      <div className="topbar-search">
        <input placeholder="Search a course..." />
      </div>

      {/* Right */}
      <div className="topbar-right">
        <button className="icon-btn">✉️</button>
        <button className="icon-btn">🔔</button>

        <div className="user-profile">
          <img src="/dashboard/avatar.png" alt="user" />
          <span>Full Name</span>
        </div>
      </div>
    </div>
  );
}
