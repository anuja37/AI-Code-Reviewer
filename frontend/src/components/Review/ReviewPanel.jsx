import ScoreRing from "./ScoreRing";
import IssueCard from "./IssueCard";
import { CheckCircle, TrendingUp, Clock, HardDrive } from "lucide-react";

export default function ReviewPanel({ review }) {
  if (!review) return null;

  const { summary, score, issues = [], complexity, improvements = [], goodPractices = [], language } = review;

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Score + Summary */}
      <div className="card" style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <ScoreRing score={score ?? 0} />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>AI Summary</h3>
          <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7 }}>{summary}</p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent2)", background: "rgba(124,106,247,0.1)", padding: "2px 10px", borderRadius: 4 }}>{language}</span>
            <span style={{ fontSize: 12, color: "var(--text2)" }}>{issues.length} issue{issues.length !== 1 ? "s" : ""} found</span>
          </div>
        </div>
      </div>

      {/* Complexity */}
      {complexity?.time && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 14, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={16} color="var(--accent)" /> Complexity Analysis
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <Clock size={14} color="var(--yellow)" />
              <span style={{ fontSize: 13, color: "var(--text2)" }}>Time:</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--yellow)", fontWeight: 600 }}>{complexity.time}</span>
            </div>
            <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <HardDrive size={14} color="var(--blue)" />
              <span style={{ fontSize: 13, color: "var(--text2)" }}>Space:</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--blue)", fontWeight: 600 }}>{complexity.space}</span>
            </div>
          </div>
          {complexity.explanation && (
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{complexity.explanation}</p>
          )}
        </div>
      )}

      {/* Issues */}
      {issues.length > 0 && (
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Issues ({issues.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {issues.map((issue, i) => <IssueCard key={i} issue={issue} />)}
          </div>
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>💡 Improvements</h3>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 0, listStyle: "none" }}>
            {improvements.map((imp, i) => (
              <li key={i} style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.5, display: "flex", gap: 8 }}>
                <span style={{ color: "var(--accent)", fontWeight: 700, minWidth: 16 }}>{i + 1}.</span> {imp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Good Practices */}
      {goodPractices.length > 0 && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 15, color: "var(--green)" }}>
            <CheckCircle size={15} style={{ display: "inline", marginRight: 6 }} />
            What's Good
          </h3>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 0, listStyle: "none" }}>
            {goodPractices.map((gp, i) => (
              <li key={i} style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.5, display: "flex", gap: 8 }}>
                <CheckCircle size={14} color="var(--green)" style={{ minWidth: 14, marginTop: 2 }} /> {gp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
