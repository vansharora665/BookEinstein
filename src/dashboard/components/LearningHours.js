export default function LearningHours() {
  const data = [
    { label: "W1", value: 40 },
    { label: "W2", value: 70 },
    { label: "W3", value: 55, active: true },
    { label: "W4", value: 80 },
  ];

  return (
    <div className="learning-hours">
      <h3>Learning Hours</h3>

      <div className="chart">
        {data.map((d, i) => (
          <div key={i} className="bar-wrap">
            <div
              className={`bar ${d.active ? "active" : ""}`}
              style={{ height: `${d.value}%` }}
            />
            <span>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
