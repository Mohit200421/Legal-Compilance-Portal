import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { 
  Scale, 
  ArrowLeft, 
  KeyRound,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock
} from "lucide-react";

// Import the app logo
import appLogo from "../assets/app_logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!email) {
      setMsg({ type: "error", text: "Email is required" });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      setMsg({ type: "success", text: res.data?.msg || "Reset OTP sent to email" });
      setStep(2);
      startTimer();
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.msg || "Failed to send OTP" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setMsg({ type: "", text: "" });

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      setMsg({ type: "success", text: res.data?.msg || "New OTP sent to email" });
      startTimer();
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.msg || "Failed to resend OTP" 
      });
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const otpString = otp.join("");
    
    if (!email || otpString.length !== 6) {
      setMsg({ type: "error", text: "Email and valid 6-digit OTP are required" });
      return;
    }

    if (!newPassword) {
      setMsg({ type: "error", text: "New password is required" });
      return;
    }

    if (newPassword.length < 8) {
      setMsg({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/reset-password", {
        email,
        otp: otpString,
        newPassword,
      });

      setMsg({ type: "success", text: res.data?.msg || "Password reset successfully" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.msg || "Failed to reset password" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button - Hidden on mobile, visible on desktop */}
      <div className="hidden md:block absolute top-6 left-6 md:top-8 md:left-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo with Image - App name below logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center justify-center space-y-3 mb-4">
              <img 
                src={appLogo} 
                alt="LawSetu Logo" 
                className="h-16 w-auto object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                LawSetu
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {step === 1
                ? "Enter your email address and we'll send you a verification code."
                : "Enter the 6-digit code sent to your email and set a new password."}
            </p>
          </div>

          {/* Message Alert */}
          {msg.text && (
            <div className={`border-l-4 p-4 mb-6 ${
              msg.type === "success" 
                ? "bg-green-50 border-green-500" 
                : "bg-red-50 border-red-500"
            }`}>
              <div className="flex items-center">
                {msg.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                )}
                <p className={`text-sm ${
                  msg.type === "success" ? "text-green-700" : "text-red-700"
                }`}>
                  {msg.text}
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Email Form - No Card */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-gray-300 text-gray-900 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center space-x-2 group mt-8"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Reset Password Form - No Card */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">
                    Enter the 6-digit code sent to {email}
                  </p>
                  {!canResend && timer > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center bg-transparent border-b-2 border-gray-300 text-gray-900 text-lg font-semibold focus:border-blue-600 focus:outline-none transition-colors"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-transparent border-b-2 border-gray-300 text-gray-900 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters with at least one number
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-gray-300 text-gray-900 focus:border-blue-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || !canResend}
                  className="px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  title="Resend OTP"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to email entry
              </button>
            </form>
          )}

          {/* Footer Link */}
          <div className="text-center pt-6">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Support Link */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Having trouble?{" "}
            <button className="text-blue-600 hover:underline font-medium">
              Contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}