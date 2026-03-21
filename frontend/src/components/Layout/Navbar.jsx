import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Code2, History, LogOut, LogIn, UserPlus, Zap } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: "rgba(10,10,15,0.9)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ background: "var(--accent)", borderRadius: 8, padding: 6, display: "flex" }}>
            <Zap size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", fontFamily: "var(--font-sans)" }}>
            Code<span style={{ color: "var(--accent)" }}>Review</span>AI
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user ? (
            <>
              <Link to="/editor" className="btn btn-ghost" style={{ padding: "7px 14px", textDecoration: "none", color: isActive("/editor") ? "var(--accent)" : "var(--text2)" }}>
                <Code2 size={16} /> Editor
              </Link>
              <Link to="/history" className="btn btn-ghost" style={{ padding: "7px 14px", textDecoration: "none", color: isActive("/history") ? "var(--accent)" : "var(--text2)" }}>
                <History size={16} /> History
              </Link>
              <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 4px" }} />
              <span style={{ fontSize: 13, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>
                {user.name}
              </span>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: "7px 12px" }}>
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ padding: "7px 14px", textDecoration: "none" }}>
                <LogIn size={15} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: "7px 16px", textDecoration: "none" }}>
                <UserPlus size={15} /> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
