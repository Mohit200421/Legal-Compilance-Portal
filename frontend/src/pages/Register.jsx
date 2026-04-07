import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  Scale,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Mail,
  User,
  Lock,
  UserCircle,
} from "lucide-react";

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

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);

    if (e.target.name === "password") {
      calculatePasswordStrength(e.target.value);
    }
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

    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      alert(res.data?.msg || "Registration successful! OTP sent to email ✅");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
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
              Create Account
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Get started with your free account
            </p>
          </div>

          {/* Register Form - No Card */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-gray-300 text-gray-900 focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="johnsmith"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-gray-300 text-gray-900 focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-transparent border-b-2 border-gray-300 text-gray-900 focus:border-blue-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
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

              {/* Password Strength Meter */}
              {form.password && (
                <div className="mt-3">
                  <div className="flex space-x-1 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 ${
                          level <= passwordStrength
                            ? level === 1
                              ? "bg-red-500"
                              : level === 2
                              ? "bg-yellow-500"
                              : level === 3
                              ? "bg-blue-500"
                              : "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {passwordStrength === 0 && "Enter a password"}
                    {passwordStrength === 1 && "Weak password"}
                    {passwordStrength === 2 && "Fair password"}
                    {passwordStrength === 3 && "Good password"}
                    {passwordStrength === 4 && "Strong password"}
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
                className="h-4 w-4 mt-0.5 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label
                htmlFor="terms"
                className="ml-2 text-sm text-gray-600"
              >
                I agree to the{" "}
                <Link
                  to="/terms-and-conditions"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
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
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-700"
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
        </div>
      </div>

      {/* Mobile Lawyer Button */}
      <button
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all lg:hidden"
        onClick={() => navigate("/apply-lawyer")}
        title="Lawyer Portal"
      >
        <Briefcase className="h-5 w-5" />
      </button>
    </div>
  );
}