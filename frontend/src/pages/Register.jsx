import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Mail,
  User,
  Lock,
  UserCircle,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);

    if (e.target.name === "password") {
      calculatePasswordStrength(e.target.value);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordStrength < 3) {
      toast.error("Please create a stronger password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form, {
        withCredentials: true,
      });

      console.log("REGISTER RESPONSE:", res.data);

      // SUCCESS TOAST
      toast.success(
        res.data?.msg || "Registration successful! Verify your OTP.",
      );

      // REDIRECT TO OTP PAGE
      navigate("/verify-otp", {
        replace: true,
        state: {
          email: form.email,
        },
      });
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      toast.error(
        err.response?.data?.msg ||
          err.response?.data?.error ||
          "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  // Password strength config
  const strengthConfig = {
    0: { label: "Enter a password", color: colors.outlineVariant, width: "0%" },
    1: { label: "Weak password", color: colors.error, width: "25%" },
    2: { label: "Fair password", color: colors.tertiary, width: "50%" },
    3: { label: "Good password", color: colors.secondary, width: "75%" },
    4: { label: "Strong password", color: "#4caf50", width: "100%" },
  };

  // Glassmorphism card style
  const glassCardClass =
    "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-xl text-base transition-all duration-200 focus:outline-none";

  // Handle input focus and blur
  const handleInputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.secondary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
  };

  const handleInputBlur = (e, fieldName) => {
    const hasError = touched[fieldName] && !form[fieldName];
    e.currentTarget.style.borderColor = hasError
      ? colors.error
      : colors.outlineVariant;
    e.currentTarget.style.boxShadow = "none";
    if (fieldName) {
      handleBlur(fieldName);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 30%, ${colors.secondary}05, transparent 60%),
                      radial-gradient(circle at 80% 70%, ${colors.secondary}03, transparent 50%)`,
        }}
      />

      {/* Back Button - Glassmorphism */}
      <div className="hidden md:block fixed top-6 left-6 md:top-8 md:left-8 z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 group"
          style={{ color: colors.onSurfaceVariant }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              colors.surfaceContainerHighest;
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
                alt="LegalSetu Logo"
                className="h-6 w-auto object-contain"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span
                className="text-2xl font-bold"
                style={{ color: colors.onSurface }}
              >
                Legal<span style={{ color: colors.secondary }}>Setu</span>
              </span>
              <Sparkles
                className="h-4 w-4"
                style={{ color: colors.secondary }}
              />
            </div>
          </div>
          <h2
            className="text-2xl font-bold mb-2 leading-[1.3] tracking-[-0.01em]"
            style={{ color: colors.onSurface }}
          >
            Create Account
          </h2>
          <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
            Get started with your free account
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: colors.onSurfaceVariant }}
            >
              Full Name
            </label>
            <div className="relative">
              <UserCircle
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                style={{ color: colors.outline }}
              />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Smith"
                className={inputClass}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${touched.name && !form.name ? colors.error : colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur(e, "name")}
              />
            </div>
          </div>

          {/* Username Field */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: colors.onSurfaceVariant }}
            >
              Username
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                style={{ color: colors.outline }}
              />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                placeholder="johnsmith"
                className={inputClass}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${touched.username && !form.username ? colors.error : colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur(e, "username")}
              />
            </div>
          </div>

          {/* Email Field */}
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
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="john@company.com"
                className={inputClass}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${touched.email && !form.email ? colors.error : colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur(e, "email")}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: colors.onSurfaceVariant }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                style={{ color: colors.outline }}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                className={inputClass}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                  paddingRight: "44px",
                }}
                onFocus={handleInputFocus}
                onBlur={(e) => handleInputBlur(e)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: colors.outline }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.onSurfaceVariant)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.outline)
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Password Strength Meter */}
            {form.password && (
              <div className="mt-3">
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: colors.surfaceContainerHighest }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: strengthConfig[passwordStrength]?.width,
                      backgroundColor: strengthConfig[passwordStrength]?.color,
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p
                    className="text-xs"
                    style={{ color: strengthConfig[passwordStrength]?.color }}
                  >
                    {strengthConfig[passwordStrength]?.label}
                  </p>
                  {passwordStrength === 4 && (
                    <CheckCircle2
                      className="h-3 w-3"
                      style={{ color: "#4caf50" }}
                    />
                  )}
                </div>
                <p
                  className="text-[10px] mt-1"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Use 8+ chars with uppercase, number & symbol
                </p>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start pt-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="h-4 w-4 mt-0.5 rounded transition-all duration-200 focus:ring-2"
              style={{
                borderColor: colors.outlineVariant,
                accentColor: colors.secondary,
              }}
            />
            <label
              htmlFor="terms"
              className="ml-2 text-sm"
              style={{ color: colors.onSurfaceVariant }}
            >
              I agree to the{" "}
              <Link
                to="/terms-and-conditions"
                className="font-medium transition-colors"
                style={{ color: colors.secondary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.secondaryContainer)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.secondary)
                }
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="font-medium transition-colors"
                style={{ color: colors.secondary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.secondaryContainer)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.secondary)
                }
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group mt-8"
            style={{
              backgroundColor: colors.secondary,
              color: "white",
              boxShadow: `0 4px 12px ${colors.secondary}40`,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor =
                  colors.secondaryContainer;
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
                <span>Creating account...</span>
              </div>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium transition-colors"
                style={{ color: colors.secondary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.secondaryContainer)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.secondary)
                }
              >
                Sign in
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
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = colors.onSurface)
            }
          >
            <Briefcase className="h-4 w-4" />
            <span>Are you a lawyer? Apply for lawyer portal</span>
          </Link>
        </div>

        {/* Support Link */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: colors.onSurfaceVariant }}
        >
          Having trouble?{" "}
          <button
            className="font-medium transition-colors"
            style={{ color: colors.secondary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = colors.secondaryContainer)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = colors.secondary)
            }
          >
            Contact support
          </button>
        </p>
      </div>

      {/* Mobile Lawyer Button - Glassmorphism */}
      <button
        className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-all duration-300 lg:hidden"
        style={{
          backgroundColor: colors.secondary,
          color: "white",
          boxShadow: `0 4px 12px ${colors.secondary}40`,
        }}
        onClick={() => navigate("/apply-lawyer")}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.secondaryContainer;
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.secondary;
          e.currentTarget.style.transform = "scale(1)";
        }}
        title="Lawyer Portal"
      >
        <Briefcase className="h-5 w-5" />
      </button>

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
