import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Eye, Trash2, Code2, Calendar } from "lucide-react";

const scoreColor = (s) => s >= 75 ? "var(--green)" : s >= 50 ? "var(--yellow)" : "var(--red)";

export default function History() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchHistory = async (p = 1) => {
    try {
      const { data } = await api.get(`/history?page=${p}&limit=10`);
      setReviews(data.reviews);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(page); }, [page]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/history/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
      toast.success("Review deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
      <div className="spinner" style={{ width: 36, height: 36 }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 24 }}>Review History</h1>
          <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 4 }}>{total} reviews total</p>
        </div>
        <Link to="/editor" className="btn btn-primary" style={{ textDecoration: "none" }}>
          <Code2 size={15} /> New Review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text2)" }}>
          <Code2 size={40} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p>No reviews yet. <Link to="/editor" style={{ color: "var(--accent)" }}>Start your first one!</Link></p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.map(r => (
            <div key={r._id} className="card" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {/* Score */}
              <div style={{ width: 48, height: 48, borderRadius: "50%", border: `3px solid ${scoreColor(r.score)}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, color: scoreColor(r.score) }}>{r.score}</span>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                  <h3 style={{ fontWeight: 600, fontSize: 15 }}>{r.title}</h3>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent2)", background: "rgba(124,106,247,0.1)", padding: "2px 8px", borderRadius: 4 }}>{r.language}</span>
                </div>
                <div style={{ display: "flex", gap: 12, color: "var(--text2)", fontSize: 13, alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={12} /> {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <span>{r.issues?.length ?? 0} issues</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <Link to={`/review/${r._id}`} className="btn btn-ghost" style={{ padding: "6px 14px", textDecoration: "none", fontSize: 13 }}>
                  <Eye size={14} /> View
                </Link>
                <button className="btn btn-danger" style={{ padding: "6px 12px", fontSize: 13 }} onClick={() => handleDelete(r._id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 10 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: "6px 14px" }}>Prev</button>
          <span style={{ display: "flex", alignItems: "center", color: "var(--text2)", fontSize: 14 }}>Page {page}</span>
          <button className="btn btn-ghost" disabled={reviews.length < 10} onClick={() => setPage(p => p + 1)} style={{ padding: "6px 14px" }}>Next</button>
        </div>
      )}
    </div>
  );
}
