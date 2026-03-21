import { AlertCircle, AlertTriangle, Lightbulb, Info } from "lucide-react";

const icons = {
  bug: <AlertCircle size={14} />,
  warning: <AlertTriangle size={14} />,
  suggestion: <Lightbulb size={14} />,
  info: <Info size={14} />,
};

export default function IssueCard({ issue }) {
  const { line, type = "info", message, fix } = issue;

  return (
    <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span className={`badge badge-${type}`}>{icons[type]} {type}</span>
        {line && (
          <span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>Line {line}</span>
        )}
      </div>
      <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>{message}</p>
      {fix && (
        <div style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 6, padding: "8px 12px" }}>
          <p style={{ fontSize: 13, color: "var(--green)", fontFamily: "var(--font-mono)" }}>💡 {fix}</p>
        </div>
      )}
    </div>
  );
}
