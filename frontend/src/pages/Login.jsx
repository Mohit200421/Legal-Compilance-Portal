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
} from "lucide-react";

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

// ✅ STORE TOKEN
localStorage.setItem("token", token);

// (optional but good)
localStorage.setItem("user", JSON.stringify(user));

// if your context needs it
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Back Button */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                LawSetu
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Sign in to access your account
            </p>
          </div>

          {/* Error Alert */}
          {err && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 flex-1">
                  {err}
                </p>
                <button
                  onClick={() => setErr("")}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Login Form - No Card */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-gray-300 text-gray-900 focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-gray-300 text-gray-900 focus:border-blue-600 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center space-x-2 group mt-8"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
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
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-700"
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
              className="inline-flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              <span>Are you a lawyer? Apply for lawyer portal</span>
            </Link>
          </div>

          {/* Support Link */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Having trouble?{" "}
            <button className="text-blue-600 hover:underline font-medium">
              Contact support
            </button>
          </p>

          {/* Terms Links */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <Link
                to="/terms-and-conditions"
                className="text-blue-600 hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}