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
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";

// Import the app logo
import appLogo from "../../assets/app_logo.svg";

// Lex-Modernism Color System
const colors = {
  primary: "#091426",
  primaryContainer: "#1e293b",
  onPrimaryContainer: "#8590a6",
  secondary: "#4648d4",
  secondaryContainer: "#6063ee",
  onSecondaryContainer: "#fffbff",
  surface: "#fbf8fa",
  surfaceDim: "#dcd9db",
  surfaceBright: "#fbf8fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f5f3f4",
  surfaceContainer: "#f0edef",
  surfaceContainerHigh: "#eae7e9",
  surfaceContainerHighest: "#e4e2e3",
  onSurface: "#1b1b1d",
  onSurfaceVariant: "#45474c",
  outline: "#75777d",
  outlineVariant: "#c5c6cd",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onError: "#ffffff",
  onErrorContainer: "#93000a",
  tertiary: "#1e1200",
  tertiaryContainer: "#35260c",
  onTertiaryContainer: "#a38c6a",
};

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
  const [touched, setTouched] = useState({});

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

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
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

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";
  
  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none";

  const handleInputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.secondary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
  };

  const handleInputBlur = (e, fieldName) => {
    const hasError = fieldName === "email" && touched[fieldName] && !email;
    e.currentTarget.style.borderColor = hasError ? colors.error : colors.outlineVariant;
    e.currentTarget.style.boxShadow = "none";
  };

  // Combined handler for email blur
  const handleEmailBlur = (e) => {
    const hasError = touched.email && !email;
    e.currentTarget.style.borderColor = hasError ? colors.error : colors.outlineVariant;
    e.currentTarget.style.boxShadow = "none";
    handleBlur("email");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.surface }}>
      {/* Background decorative elements */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${colors.secondary}05, transparent 60%),
                      radial-gradient(circle at 80% 70%, ${colors.secondary}03, transparent 50%)`
        }}
      />
      
      {/* Back Button - Glassmorphism */}
      <div className="hidden md:block fixed top-6 left-6 md:top-8 md:left-8 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 group"
          style={{ color: colors.onSurfaceVariant }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest;
            e.currentTarget.style.color = colors.onSurface;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = colors.onSurfaceVariant;
          }}
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center space-y-3 mb-4">
            <div className={`p-3 rounded-2xl ${glassCardClass}`}>
              <img 
                src={appLogo} 
                alt="LawSetu Logo" 
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold" style={{ color: colors.onSurface }}>
                Law<span style={{ color: colors.secondary }}>Setu</span>
              </span>
              <Sparkles className="h-4 w-4" style={{ color: colors.secondary }} />
            </div>
          </div>
          
          <h2 
            className="text-2xl font-bold mb-2 leading-[1.3] tracking-[-0.01em]"
            style={{ color: colors.onSurface }}
          >
            Check your inbox
          </h2>
          <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
            We've sent a 6-digit verification code to
          </p>
          <p className="text-base font-medium mt-1" style={{ color: colors.secondary }}>
            {email || "your email"}
          </p>
        </div>

        {/* Message Alert */}
        {msg.text && (
          <div 
            className="rounded-xl p-4 mb-6"
            style={{ 
              backgroundColor: msg.type === "success" ? "#e8f5e9" : colors.errorContainer,
              border: `1px solid ${msg.type === "success" ? "#4caf50" : colors.error}20`
            }}
          >
            <div className="flex items-center">
              {msg.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: "#4caf50" }} />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" style={{ color: colors.onErrorContainer }} />
              )}
              <p 
                className="text-sm"
                style={{ color: msg.type === "success" ? "#2e7d32" : colors.onErrorContainer }}
              >
                {msg.text}
              </p>
            </div>
          </div>
        )}

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {/* Email Input */}
          <div>
            <label 
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: colors.onSurfaceVariant }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail 
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" 
                style={{ color: colors.outline }} 
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${touched.email && !email ? colors.error : colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={handleEmailBlur}
              />
            </div>
          </div>

          {/* OTP Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label 
                className="block text-xs font-semibold uppercase tracking-wider"
                style={{ color: colors.onSurfaceVariant }}
              >
                Verification Code
              </label>
              {!canResend && timer > 0 && (
                <div className="flex items-center text-xs" style={{ color: colors.onSurfaceVariant }}>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center rounded-xl text-lg font-semibold transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: colors.surfaceContainerLowest,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.secondary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.outlineVariant;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <p className="text-xs text-center mt-3" style={{ color: colors.onSurfaceVariant }}>
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group mt-8"
            style={{ 
              backgroundColor: colors.secondary,
              color: "white",
              boxShadow: `0 4px 12px ${colors.secondary}40`
            }}
            onMouseEnter={(e) => {
              if (!loading && otp.join("").length === 6) {
                e.currentTarget.style.backgroundColor = colors.secondaryContainer;
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 6px 16px ${colors.secondary}50`;
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = colors.secondary;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.secondary}40`;
              }
            }}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                <span>Verifying...</span>
              </div>
            ) : (
              <>
                <span>Verify Email</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div className="mt-6 text-center">
          <p className="text-sm mb-2" style={{ color: colors.onSurfaceVariant }}>
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resending || !canResend}
            className="text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: colors.secondary }}
            onMouseEnter={(e) => {
              if (!resending && canResend) {
                e.currentTarget.style.color = colors.secondaryContainer;
              }
            }}
            onMouseLeave={(e) => {
              if (!resending && canResend) {
                e.currentTarget.style.color = colors.secondary;
              }
            }}
          >
            {resending ? (
              <span className="flex items-center justify-center space-x-1">
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.secondary, borderTopColor: "transparent" }} />
                <span>Sending...</span>
              </span>
            ) : (
              "Click to resend"
            )}
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center pt-6">
          <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
            Back to{" "}
            <Link
              to="/login"
              className="font-medium transition-colors"
              style={{ color: colors.secondary }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.secondaryContainer}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.secondary}
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs mt-6" style={{ color: colors.onSurfaceVariant }}>
          Having trouble?{" "}
          <button 
            className="font-medium transition-colors"
            style={{ color: colors.secondary }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.secondaryContainer}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.secondary}
          >
            Contact support
          </button>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}