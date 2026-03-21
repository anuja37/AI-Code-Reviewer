export default function ScoreRing({ score }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 75 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";
  const label = score >= 75 ? "Good" : score >= 50 ? "Fair" : "Needs Work";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={radius} fill="none" stroke="var(--border)" strokeWidth={8} />
        <circle
          cx={50} cy={50} r={radius} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x={50} y={50} textAnchor="middle" dy="0.35em" fill={color} fontSize={20} fontWeight={700} fontFamily="var(--font-mono)">{score}</text>
      </svg>
      <span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>{label}</span>
    </div>
  );
}
