import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import ReviewPanel from "../components/Review/ReviewPanel";
import { ArrowLeft, Code2, Trash2 } from "lucide-react";

export default function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    api.get(`/history/${id}`)
      .then(({ data }) => setReview(data))
      .catch(() => { toast.error("Review not found"); navigate("/history"); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this review?")) return;
    await api.delete(`/history/${id}`);
    toast.success("Deleted");
    navigate("/history");
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}><div className="spinner" style={{ width: 36, height: 36 }} /></div>;
  if (!review) return null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <Link to="/history" className="btn btn-ghost" style={{ padding: "7px 12px", textDecoration: "none" }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontWeight: 800, fontSize: 22 }}>{review.title}</h1>
          <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 2 }}>
            {review.language} · {new Date(review.createdAt).toLocaleString()}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => setShowCode(!showCode)} style={{ padding: "7px 14px", fontSize: 13 }}>
          <Code2 size={14} /> {showCode ? "Hide" : "Show"} Code
        </button>
        <button className="btn btn-danger" onClick={handleDelete} style={{ padding: "7px 12px" }}>
          <Trash2 size={14} />
        </button>
      </div>

      {/* Original code */}
      {showCode && (
        <div className="card fade-in" style={{ marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: 14, color: "var(--text2)" }}>Original Code</h3>
          <pre style={{ fontFamily: "var(--font-mono)", fontSize: 13, overflowX: "auto", color: "var(--text)", lineHeight: 1.6, background: "var(--bg3)", padding: 16, borderRadius: 8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {review.code}
          </pre>
        </div>
      )}

      <ReviewPanel review={review} />
    </div>
  );
}
