import "./StatCard.css";

function StatCard({ title, value, color }) {
  return (
    <div className="stat-card">
      <span>{title}</span>

      <h2 style={{ color }}>{value}</h2>
    </div>
  );
}

export default StatCard;