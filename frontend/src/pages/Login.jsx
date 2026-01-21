import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";
import securityIcon from "../assets/security.png";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      // ✅ FIXED route
      const res = await API.post("/auth/login", { email, password });


      const { user } = res.data;

      // ✅ Cookie already set by backend
      await login();

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "lawyer") navigate("/lawyer");
      else navigate("/user");
    } catch (error) {
      const msg = error.response?.data?.msg || "Invalid email or password";

      if (msg.toLowerCase().includes("verify your email")) {
        alert("Please verify your email first ✅");
        navigate("/verify-otp", { state: { email } });
      } else {
        setErr(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <button
        className="lawyer-floating-btn"
        type="button"
        onClick={() => navigate("/apply-lawyer")}
      >
        Lawyers click here
      </button>

      <form className="login-card" onSubmit={handleLogin}>
        <div className="logo">
          <img src={securityIcon} alt="Security Icon" className="shield" />
          <h2 className="lawsetu">LawSetu</h2>
        </div>

        <p className="subtitle">Login to your account</p>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-box">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {err && <p className="error">{err}</p>}

        <button disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="register">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>

        <p className="register">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </form>
    </div>
  );
}
