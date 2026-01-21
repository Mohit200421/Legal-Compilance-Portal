import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../../api/axios";

import "./VerifyOtp.css";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Safe email fetch (won't crash)
  const initialEmail = location?.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [msg, setMsg] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!email || !otp) {
      return setMsg("Email and OTP are required");
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/verify-otp", { email, otp });

      setMsg(res.data?.msg || "Email verified successfully ✅");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setMsg(err.response?.data?.msg || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMsg("");

    if (!email) {
      return setMsg("Please enter your email first");
    }

    try {
      setResending(true);
      const res = await API.post("/auth/resend-otp", { email });
      setMsg(res.data?.msg || "New OTP sent to email ✅");
    } catch (err) {
      setMsg(err.response?.data?.msg || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-wrapper">
      <div className="verify-card">
        <h2 className="verify-title">Verify OTP</h2>
        <p className="verify-subtitle">
          Enter the OTP sent to your email to activate your account.
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="otp-input"
            type="text"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />

          {msg && (
            <p
              className={`verify-msg ${
                msg.toLowerCase().includes("success") || msg.includes("✅")
                  ? "success"
                  : "error"
              }`}
            >
              {msg}
            </p>
          )}

          <button className="verify-btn" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button className="resend-btn" onClick={handleResend} disabled={resending}>
          {resending ? "Sending..." : "Resend OTP"}
        </button>

        <p className="back-login">
          Back to <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
