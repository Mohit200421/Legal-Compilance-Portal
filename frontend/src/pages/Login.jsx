import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  Scale,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Briefcase,
  ArrowRight,
  AlertCircle,
  X,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

// Import the app logo
import appLogo from "../assets/app_logo.svg";

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

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const res = await API.post("/auth/login", { email, password });
      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      await login(user);

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

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.surface }}>
      {/* Background decorative elements */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 10% 20%, ${colors.secondary}08, transparent 50%),
                      radial-gradient(circle at 90% 80%, ${colors.secondary}05, transparent 50%)`
        }}
      />
      
      {/* Back Button - Glassmorphism */}
      <div className="hidden md:block fixed top-6 left-6 md:top-8 md:left-8 z-10">
        <button
          onClick={() => navigate("/")}
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
          <span className="text-sm font-medium">Back to Home</span>
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
              <span className="text-2xl font-bold" style={{ color: colors.onSurface }}>
                Law<span style={{ color: colors.secondary }}>Setu</span>
              </span>
              <Sparkles className="h-4 w-4" style={{ color: colors.secondary }} />
            </div>
          </div>
          <h2 
            className="text-2xl font-bold mb-2 leading-[1.3] tracking-[-0.01em]"
            style={{ color: colors.onSurface }}
          >
            Welcome Back
          </h2>
          <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
            Sign in to access your account
          </p>
        </div>

        {/* Error Alert - Glassmorphism */}
        {err && (
          <div 
            className="rounded-xl p-4 mb-6"
            style={{ 
              backgroundColor: colors.errorContainer,
              border: `1px solid ${colors.error}20`
            }}
          >
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" style={{ color: colors.onErrorContainer }} />
              <p className="text-sm flex-1" style={{ color: colors.onErrorContainer }}>
                {err}
              </p>
              <button
                onClick={() => setErr("")}
                className="transition-colors"
                style={{ color: colors.onErrorContainer }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label 
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: colors.onSurfaceVariant }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: colors.outline }} />
              <input
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none"
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
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label 
                className="block text-xs font-semibold uppercase tracking-wider"
                style={{ color: colors.onSurfaceVariant }}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium transition-colors"
                style={{ color: colors.secondary }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.secondaryContainer}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.secondary}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: colors.outline }} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none"
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: colors.outline }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.onSurfaceVariant}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.outline}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group mt-8"
            style={{ 
              backgroundColor: colors.secondary,
              color: "white",
              boxShadow: `0 4px 12px ${colors.secondary}40`
            }}
            onMouseEnter={(e) => {
              if (!loading) {
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
                <div 
                  className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"
                />
                <span>Signing in...</span>
              </div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Register Link */}
          <div className="text-center pt-4">
            <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium transition-colors"
                style={{ color: colors.secondary }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.secondaryContainer}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.secondary}
              >
                Create account
              </Link>
            </p>
          </div>
        </form>

        {/* Lawyer Portal Link */}
        <div className="mt-6 text-center">
          <Link
            to="/apply-lawyer"
            className="inline-flex items-center justify-center space-x-2 text-sm transition-colors"
            style={{ color: colors.onSurfaceVariant }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.onSurface}
          >
            <Briefcase className="h-4 w-4" />
            <span>Are you a lawyer? Apply for lawyer portal</span>
          </Link>
        </div>

        {/* Support Link */}
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

        {/* Terms Links */}
        <div className="text-center mt-4">
          <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
            By signing in, you agree to our{" "}
            <Link
              to="/terms-and-conditions"
              className="transition-colors"
              style={{ color: colors.secondary }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.secondaryContainer}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.secondary}
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/terms-and-conditions"
              className="transition-colors"
              style={{ color: colors.secondary }}
              onMouseEnter={(e) => e.currentTarget.style.color = colors.secondaryContainer}
              onMouseLeave={(e) => e.currentTarget.style.color = colors.secondary}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
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