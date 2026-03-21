import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Editor from "./pages/Editor";
import History from "./pages/History";
import ReviewDetail from "./pages/ReviewDetail";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/editor" /> : children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: "#1a1a24", color: "#e8e8f0", border: "1px solid #2a2a3a" } }} />
        <Routes>
          <Route path="/" element={<><Navbar /><Landing /></>} />
          <Route path="/login" element={<PublicRoute><Navbar /><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Navbar /><Register /></PublicRoute>} />
          <Route path="/editor" element={<PrivateRoute><Navbar /><Editor /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><Navbar /><History /></PrivateRoute>} />
          <Route path="/review/:id" element={<PrivateRoute><Navbar /><ReviewDetail /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
