import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import {
  Scale,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Briefcase,
  MessageSquare,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Award,
  Calendar,
  Hash,
  FileCheck,
  Upload,
  Info,
  Sparkles,
  ArrowRight,
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

export default function ApplyLawyer() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    barId: "",
    city: "",
    state: "",
    specialization: "",
    experience: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.barId) newErrors.barId = "Bar Council ID is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.specialization)
      newErrors.specialization = "Specialization is required";
    if (!form.experience) newErrors.experience = "Experience is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/apply-lawyer", form);

      alert("Your request submitted successfully ✅");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  // Glassmorphism card style
  const glassCardClass =
    "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  const inputClass =
    "w-full pl-9 pr-4 py-2.5 rounded-xl text-base transition-all duration-200 focus:outline-none";

  const handleInputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.secondary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
  };

  const handleInputBlur = (e, fieldName) => {
    const hasError = errors[fieldName];
    e.currentTarget.style.borderColor = hasError
      ? colors.error
      : colors.outlineVariant;
    e.currentTarget.style.boxShadow = "none";
    handleBlur(fieldName);
  };

  const inputFields = [
    {
      name: "name",
      label: "Full Name",
      placeholder: "Enter your full name",
      icon: User,
      type: "text",
      colSpan: "col-span-2",
    },
    {
      name: "email",
      label: "Email Address",
      placeholder: "your@email.com",
      icon: Mail,
      type: "email",
      colSpan: "col-span-1",
    },
    {
      name: "phone",
      label: "Phone Number",
      placeholder: "+91 98765 43210",
      icon: Phone,
      type: "tel",
      colSpan: "col-span-1",
    },
    {
      name: "barId",
      label: "Bar Council ID",
      placeholder: "BCI/12345/2020",
      icon: Hash,
      type: "text",
      colSpan: "col-span-2",
    },
    {
      name: "city",
      label: "City",
      placeholder: "Mumbai",
      icon: MapPin,
      type: "text",
      colSpan: "col-span-1",
    },
    {
      name: "state",
      label: "State",
      placeholder: "Maharashtra",
      icon: MapPin,
      type: "text",
      colSpan: "col-span-1",
    },
    {
      name: "specialization",
      label: "Specialization",
      placeholder: "e.g., Criminal, Civil, Corporate",
      icon: Briefcase,
      type: "text",
      colSpan: "col-span-2",
    },
    {
      name: "experience",
      label: "Years of Experience",
      placeholder: "5",
      icon: Calendar,
      type: "number",
      colSpan: "col-span-2",
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 10% 20%, ${colors.secondary}05, transparent 60%),
                      radial-gradient(circle at 90% 80%, ${colors.secondary}03, transparent 50%)`,
        }}
      />

      {/* Back Button - Glassmorphism */}
      <div className="hidden md:block fixed top-6 left-6 md:top-8 md:left-8 z-10">
        <button
          onClick={() => navigate(-1)}
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
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-6">
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
                className="text-xl font-bold"
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
            Join Our Network of Legal Experts
          </h2>
          <p
            className="text-sm max-w-lg mx-auto"
            style={{ color: colors.onSurfaceVariant }}
          >
            Fill in your details below. Admin will verify and approve your
            access within 24-48 hours.
          </p>
        </div>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div
            className="rounded-xl p-4 mb-6"
            style={{
              backgroundColor: colors.errorContainer,
              border: `1px solid ${colors.error}20`,
            }}
          >
            <div className="flex items-start">
              <AlertCircle
                className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5"
                style={{ color: colors.onErrorContainer }}
              />
              <p className="text-sm" style={{ color: colors.onErrorContainer }}>
                Please fill in all required fields correctly.
              </p>
            </div>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-4">
            {inputFields.map((field) => {
              const Icon = field.icon;
              const hasError = errors[field.name];
              const isTouched = touched[field.name];

              return (
                <div key={field.name} className={field.colSpan}>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <Icon
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                        hasError ? "text-error" : "text-outline"
                      }`}
                      style={{
                        color: hasError ? colors.error : colors.outline,
                      }}
                    />
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      className={inputClass}
                      style={{
                        backgroundColor: colors.surfaceContainerLowest,
                        border: `1px solid ${hasError ? colors.error : colors.outlineVariant}`,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={(e) => handleInputBlur(e, field.name)}
                    />
                  </div>
                  {hasError && (
                    <p className="text-xs mt-1" style={{ color: colors.error }}>
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Message Textarea */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: colors.onSurfaceVariant }}
            >
              Additional Message (Optional)
            </label>
            <div className="relative">
              <MessageSquare
                className="absolute left-3 top-3 h-4 w-4"
                style={{ color: colors.outline }}
              />
              <textarea
                name="message"
                placeholder="Tell us why you'd like to join our platform, your areas of expertise, or any additional information..."
                value={form.message}
                onChange={handleChange}
                rows={3}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-base transition-all duration-200 focus:outline-none resize-none"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.outlineVariant;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Document Upload Section - Glass Card */}
          <div className={`${glassCardClass} p-4`}>
            <div className="flex items-center mb-3">
              <Upload
                className="h-4 w-4 mr-2"
                style={{ color: colors.secondary }}
              />
              <h3
                className="text-sm font-medium"
                style={{ color: colors.onSurface }}
              >
                Supporting Documents
              </h3>
              <span
                className="ml-2 text-xs"
                style={{ color: colors.onSurfaceVariant }}
              >
                (Optional)
              </span>
            </div>
            <p
              className="text-xs mb-3"
              style={{ color: colors.onSurfaceVariant }}
            >
              You can upload your Bar Council certificate, resume, or other
              relevant documents after registration.
            </p>
            <button
              type="button"
              className="px-3 py-1.5 text-xs rounded-lg transition-all duration-200"
              style={{
                border: `1px solid ${colors.outlineVariant}`,
                color: colors.onSurfaceVariant,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.surfaceContainerHighest;
                e.currentTarget.style.color = colors.onSurface;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.onSurfaceVariant;
              }}
              onClick={() =>
                alert("Document upload will be available after registration")
              }
            >
              Upload Documents
            </button>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start">
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
              className="ml-2 text-xs"
              style={{ color: colors.onSurfaceVariant }}
            >
              I confirm that the information provided is true and accurate. I
              agree to the{" "}
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

          {/* Info Note - Glass Card */}
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: `${colors.secondary}08`,
              border: `1px solid ${colors.secondary}20`,
            }}
          >
            <div className="flex items-start">
              <Info
                className="h-4 w-4 flex-shrink-0 mt-0.5 mr-2"
                style={{ color: colors.secondary }}
              />
              <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                Your application will be reviewed by our admin team. You'll
                receive an email confirmation once your account is verified and
                activated.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
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
                <span>Submitting Application...</span>
              </div>
            ) : (
              <>
                <span>Submit Application</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
            Already have a lawyer account?{" "}
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

        {/* Support Info */}
        <div
          className="mt-6 pt-4 text-center"
          style={{ borderTop: `1px solid ${colors.outlineVariant}` }}
        >
          <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
            Need help with your application?{" "}
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
