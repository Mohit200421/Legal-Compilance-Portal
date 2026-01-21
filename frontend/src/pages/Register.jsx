import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/login.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);





      alert(res.data?.msg || "Registration successful! OTP sent to email ✅");

      // ✅ Redirect to OTP page with email
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card register-card" onSubmit={handleSubmit}>
        <h2 className="register-title">Create Account</h2>
        <p className="subtitle">Register to continue</p>

        <input
          name="name"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="username"
          placeholder="Username"
          required
          value={form.username}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="register">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
