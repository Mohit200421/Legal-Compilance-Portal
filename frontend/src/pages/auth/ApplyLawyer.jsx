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
} from "lucide-react";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Back Button */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
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
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center space-x-2 mb-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                LegalCompliance
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Join Our Network of Legal Experts
            </h2>
            <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
              Fill in your details below. Admin will verify and approve your
              access within 24-48 hours.
            </p>
          </div>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">
                  Please fill in all required fields correctly.
                </p>
              </div>
            </div>
          )}

          {/* Application Form - No Card */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-4">
              {inputFields.map((field) => (
                <div key={field.name} className={field.colSpan}>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <field.icon
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                        errors[field.name]
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-4 py-2.5 bg-transparent border-b-2 ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-gray-900 focus:border-blue-600 focus:outline-none transition-colors`}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-gray-700 mb-2">
                Additional Message (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="message"
                  placeholder="Tell us why you'd like to join our platform, your areas of expertise, or any additional information..."
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-9 pr-4 py-2.5 bg-transparent border-b-2 border-gray-300 text-gray-900 focus:border-blue-600 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Document Upload Section (Placeholder) */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Upload className="h-4 w-4 text-blue-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">
                  Supporting Documents
                </h3>
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                You can upload your Bar Council certificate, resume, or other
                relevant documents after registration.
              </p>
              <button
                type="button"
                className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
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
                className="h-4 w-4 mt-0.5 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label
                htmlFor="terms"
                className="ml-2 text-xs text-gray-600"
              >
                I confirm that the information provided is true and accurate. I
                agree to the{" "}
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

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5 mr-2" />
                <p className="text-xs text-blue-700">
                  Your application will be reviewed by our admin team. You'll
                  receive an email confirmation once your account is verified
                  and activated.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                  <span>Submitting Application...</span>
                </div>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Already have a lawyer account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Support Info */}
          <div className="border-t border-gray-200 mt-6 pt-4 text-center">
            <p className="text-xs text-gray-400">
              Need help with your application?{" "}
              <button className="text-blue-600 hover:underline font-medium">
                Contact support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}