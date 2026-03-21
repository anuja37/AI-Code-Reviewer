import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { UserPlus, Zap } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created!");
      navigate("/editor");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div className="card fade-in" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ background: "var(--accent)", borderRadius: 10, padding: 10, display: "inline-flex", marginBottom: 16 }}>
            <Zap size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Create an account</h1>
          <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 6 }}>Start reviewing code with AI</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 6 }}>Name</label>
            <input className="input" type="text" placeholder="Your name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 6 }}>Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "var(--text2)", display: "block", marginBottom: 6 }}>Password</label>
            <input className="input" type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: 6, padding: "12px" }}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating...</> : <><UserPlus size={16} /> Create Account</>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--text2)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--accent)" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
