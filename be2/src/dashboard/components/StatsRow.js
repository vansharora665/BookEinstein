import "./statsRow.css";

export default function StatsRow({
  completed,
  certificates,
  hours,
  streak,
}) {
  return (
    <div className="stats-row">
      <StatCard
        icon="/dashboard/stat-course.png"
        value={completed}
        label="Courses Completed"
      />
      <StatCard
        icon="/dashboard/stat-certificate.png"
        value={certificates}
        label="Certificates Earned"
      />
      <StatCard
        icon="/dashboard/stat-hours.png"
        value={hours.toFixed(1)}
        label="Learning Hours"
      />
      <StatCard
        icon="/dashboard/stat-streak.png"
        value={`${streak} Days`}
        label="Current Streak"
      />
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card">
      <img src={icon} alt={label} />
      <div>
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}
