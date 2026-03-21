import { Link } from "react-router-dom";
import { Zap, Shield, BarChart3, ArrowRight, Code2, CheckCircle } from "lucide-react";

const features = [
  { icon: <Zap size={22} />, title: "AI-Powered Analysis", desc: "Gemini AI reviews your code for bugs, smells, and improvements instantly." },
  { icon: <BarChart3 size={22} />, title: "Complexity Analysis", desc: "Get Big O time and space complexity analysis for your algorithms." },
  { icon: <Shield size={22} />, title: "Best Practices", desc: "Learn what you're doing right and where to level up your skills." },
];

const languages = ["JavaScript", "Python", "Java", "C++", "TypeScript", "Go", "Rust", "PHP"];

export default function Landing() {
  return (
    <div style={{ minHeight: "calc(100vh - 60px)" }}>
      {/* Hero */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,106,247,0.1)", border: "1px solid rgba(124,106,247,0.3)", borderRadius: 20, padding: "6px 16px", marginBottom: 32, fontSize: 13, color: "var(--accent2)", fontFamily: "var(--font-mono)" }}>
          <Zap size={13} /> Powered by Google Gemini AI
        </div>

        <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
          Review Your Code<br />
          <span style={{ color: "var(--accent)" }}>Smarter, Faster</span>
        </h1>

        <p style={{ fontSize: 18, color: "var(--text2)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Paste your code and get instant AI-powered feedback on bugs, complexity, best practices, and actionable improvements.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: "12px 28px", fontSize: 15, textDecoration: "none" }}>
            Start Reviewing Free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn btn-ghost" style={{ padding: "12px 24px", fontSize: 15, textDecoration: "none" }}>
            <Code2 size={16} /> Live Demo
          </Link>
        </div>

        {/* Language pills */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 48 }}>
          {languages.map(l => (
            <span key={l} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 12px", fontSize: 13, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {features.map((f) => (
            <div key={f.title} className="card fade-in" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ color: "var(--accent)", background: "rgba(124,106,247,0.1)", width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 17 }}>{f.title}</h3>
              <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What you get */}
      <div style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "60px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 32 }}>Everything in one review</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "left" }}>
            {["Bug detection", "Code quality score", "Big O complexity", "Line-by-line issues", "Improvement suggestions", "Best practice highlights"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text2)", fontSize: 14 }}>
                <CheckCircle size={16} color="var(--green)" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
