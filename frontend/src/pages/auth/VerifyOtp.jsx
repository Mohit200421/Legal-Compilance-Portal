import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { 
  Scale, 
  Mail, 
  Lock, 
  Shield, 
  Clock, 
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

// Import the app logo
import appLogo from "../../assets/app_logo.png";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location?.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
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

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const otpString = otp.join("");
    
    if (!email || otpString.length !== 6) {
      return setMsg({ 
        type: "error", 
        text: "Email and valid 6-digit OTP are required" 
      });
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/verify-otp", { email, otp: otpString });

      setMsg({ 
        type: "success", 
        text: res.data?.msg || "Email verified successfully!" 
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.msg || "OTP verification failed" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMsg({ type: "", text: "" });

    if (!email) {
      return setMsg({ 
        type: "error", 
        text: "Please enter your email first" 
      });
    }

    try {
      setResending(true);
      const res = await API.post("/auth/resend-otp", { email });
      setMsg({ 
        type: "success", 
        text: res.data?.msg || "New OTP sent successfully!" 
      });
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.msg || "Failed to resend OTP" 
      });
    } finally {
      setResending(false);
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
            
            <h2 className="text-2xl font-bold text-gray-900">Check your inbox</h2>
            <p className="text-sm text-gray-600 mt-2">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-base font-medium text-blue-600 mt-1">{email || "your email"}</p>
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
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
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

          {/* Verification Form - No Card */}
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-gray-300 text-gray-900 focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* OTP Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-700">
                  Verification Code
                </label>
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
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg mt-8"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resending || !canResend}
              className="text-blue-600 font-medium hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
            >
              {resending ? (
                <span className="flex items-center justify-center space-x-1">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                  <span>Sending...</span>
                </span>
              ) : (
                "Click to resend"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-6">
            <p className="text-sm text-gray-600">
              Back to{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Help Text */}
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