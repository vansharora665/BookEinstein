const users = [
  { name: "Username 1", days: 15, score: "1,520", rank: 1 },
  { name: "Username 2", days: 12, score: "1,340", rank: 2 },
  { name: "Username 3", days: 10, score: "1,120", rank: 3 },
  { name: "Username 4", days: 8, score: "980", rank: 4 },
  { name: "Username 5", days: 7, score: "890", rank: 5 },
];

export default function Leaderboard() {
  return (
    <div className="leaderboard">
      <div className="leaderboard-head">
        <h3>Leaderboard</h3>
        <span>See All</span>
      </div>

      {users.map((u, i) => (
        <div className="leaderboard-item" key={i}>
          <div className="user">
            <div className="rank">{u.rank}</div>
            <div>
              <strong>{u.name}</strong>
              <p>🔥 {u.days} days</p>
            </div>
          </div>

          <div className="score">
            🏆 {u.score}
          </div>
        </div>
      ))}
    </div>
  );
}
