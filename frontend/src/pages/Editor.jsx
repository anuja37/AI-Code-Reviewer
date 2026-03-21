import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import toast from "react-hot-toast";
import api from "../utils/api";
import ReviewPanel from "../components/Review/ReviewPanel";
import { Zap, RotateCcw, Save, ChevronDown } from "lucide-react";

const LANGUAGES = ["javascript", "python", "java", "cpp", "typescript", "go", "rust", "php", "c", "csharp"];

const EXAMPLES = {
  javascript: `// Bubble Sort - paste your code here
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

console.log(bubbleSort([5, 3, 8, 1, 2]));`,
  python: `# Fibonacci with memoization
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]

print(fibonacci(10))`,
};

export default function Editor() {
  const [code, setCode] = useState(EXAMPLES.javascript);
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useState("");
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (EXAMPLES[lang]) setCode(EXAMPLES[lang]);
  };

  const handleReview = async () => {
    if (!code.trim()) return toast.error("Please enter some code");
    if (code.length > 10000) return toast.error("Code too long (max 10,000 chars)");
    setLoading(true);
    setReview(null);
    try {
      const { data } = await api.post("/review/analyze", { code, language, title });
      setReview(data);
      toast.success("Review complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Review failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 20px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <h1 style={{ fontWeight: 800, fontSize: 22, flex: 1 }}>Code Editor</h1>
        <input className="input" placeholder="Review title (optional)" value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: 220, padding: "8px 12px", fontSize: 13 }} />

        {/* Language selector */}
        <div style={{ position: "relative" }}>
          <select
            value={language}
            onChange={e => handleLanguageChange(e.target.value)}
            style={{ appearance: "none", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 36px 8px 14px", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: 13, cursor: "pointer", outline: "none" }}
          >
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text2)", pointerEvents: "none" }} />
        </div>

        <button className="btn btn-ghost" onClick={() => { setCode(""); setReview(null); }} style={{ padding: "8px 14px" }}>
          <RotateCcw size={15} /> Clear
        </button>

        <button className="btn btn-primary" onClick={handleReview} disabled={loading} style={{ padding: "8px 20px" }}>
          {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Analyzing...</> : <><Zap size={15} /> Review Code</>}
        </button>
      </div>

      {/* Editor + Review */}
      <div style={{ display: "grid", gridTemplateColumns: review ? "1fr 1fr" : "1fr", gap: 20, alignItems: "start" }}>

        {/* Monaco Editor */}
        <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", background: "#1e1e2e" }}>
          <div style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f87171" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34d399" }} />
            <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>
              {title || `code.${language === "python" ? "py" : language === "java" ? "java" : language === "cpp" ? "cpp" : "js"}`}
            </span>
          </div>
          <MonacoEditor
            height="520px"
            language={language}
            value={code}
            onChange={val => setCode(val || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              roundedSelection: true,
              padding: { top: 16 },
              wordWrap: "on",
            }}
          />
        </div>

        {/* Review panel */}
        {review && (
          <div style={{ maxHeight: "calc(100vh - 160px)", overflowY: "auto", paddingRight: 4 }}>
            <ReviewPanel review={review} />
          </div>
        )}
      </div>

      {/* Empty state */}
      {!review && !loading && (
        <div style={{ textAlign: "center", marginTop: 40, color: "var(--text2)" }}>
          <Zap size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p style={{ fontSize: 14 }}>Write or paste your code above, then click <strong style={{ color: "var(--accent)" }}>Review Code</strong></p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <div className="spinner" style={{ width: 36, height: 36, margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text2)", fontSize: 14 }}>Gemini AI is reviewing your code...</p>
        </div>
      )}
    </div>
  );
}
