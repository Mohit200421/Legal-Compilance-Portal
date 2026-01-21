import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./forgotpassword.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = send otp, 2 = reset password

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // ✅ Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!email) return setMsg("Email is required");

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      setMsg(res.data?.msg || "Reset OTP sent to email ✅");
      setStep(2);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!email || !otp || !newPassword) {
      return setMsg("Email, OTP and New Password are required");
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setMsg(res.data?.msg || "Password reset successfully ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-wrapper">
      <div className="fp-card">
        <h2 className="fp-title">Forgot Password</h2>
        <p className="fp-subtitle">
          {step === 1
            ? "Enter your email to receive OTP."
            : "Enter OTP and set a new password."}
        </p>

        {msg && (
          <p
            className={`fp-msg ${
              msg.includes("✅") ? "success" : "error"
            }`}
          >
            {msg}
          </p>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="fp-btn" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button className="fp-btn" type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              className="fp-secondary-btn"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}

        <p className="fp-footer">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
