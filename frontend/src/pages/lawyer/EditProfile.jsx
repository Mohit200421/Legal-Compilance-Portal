import { useEffect, useState } from "react";
import API from "../../api/axios";
import { getMyProfile, updateLawyerProfile } from "../../api/lawyerApi";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  MapPin,
  Camera,
  Save,
  X,
  Loader2,
  CheckCircle,
  Scale,
  Gavel,
  Home,
  Heart,
  Shield,
  Building,
  Landmark,
  Users,
  Car,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

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

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [newService, setNewService] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [form, setForm] = useState({
    bio: "",
    experience: "",
    practiceAreas: [],
    state: "",
    city: "",
    address: "",
    pincode: "",
    services: [],
    profileImage: "",
    phone: "",
    website: "",
    languages: [],
    education: "",
    barCouncilId: "",
    consultationFee: "",
    availableForOnline: false,
    availability: [],
  });

  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  // Safe name getter helper
  const getName = (item) => {
    if (!item) return "Unknown";
    if (typeof item === "string") return item;
    return item.name || item.title || item._id || "Unknown";
  };

  // Icon mapping for practice areas
  const getAreaIcon = (areaName) => {
    const iconMap = {
      "Criminal Law": Gavel,
      "Civil Law": Scale,
      "Corporate Law": Briefcase,
      "Family Law": Heart,
      "Property Law": Home,
      "Traffic Law": Car,
      "Employment Law": Users,
      "Intellectual Property": Shield,
      "Tax Law": Landmark,
      "Real Estate": Building,
    };
    return iconMap[areaName] || Scale;
  };

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/lawyer/profile", {
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = res.data?.data || res.data;
        setForm({
          bio: data.bio || "",
          experience: data.experience || "",
          practiceAreas:
            data.practiceAreas
              ?.map((p) => (typeof p === "string" ? p : p?._id || p?.name))
              .filter(Boolean) || [],
          state: data.location?.state || "",
          city: data.location?.city || "",
          address: data.location?.address || "",
          pincode: data.location?.pincode || "",
          services: data.services || [],
          profileImage: data.profileImage || "",
          phone: data.phone || "",
          website: data.website || "",
          languages: data.languages || [],
          education: data.education || "",
          barCouncilId: data.barCouncilId || "",
          consultationFee: data.consultationFee || "",
          availableForOnline: data.availableForOnline || false,
          availability: data.availability || [],
        });

        setImagePreview(data.profileImage || "");
      } catch (error) {
        console.log("PROFILE ERROR:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* ================= LOAD PRACTICE AREAS ================= */
  useEffect(() => {
    API.get("/public/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ================= SERVICES HANDLERS ================= */
  const addService = () => {
    if (newService.trim()) {
      setForm({
        ...form,
        services: [...form.services, newService.trim()],
      });
      setNewService("");
    }
  };

  const removeService = (index) => {
    setForm({
      ...form,
      services: form.services.filter((_, i) => i !== index),
    });
  };

  /* ================= LANGUAGES HANDLERS ================= */
  const addLanguage = (language) => {
    if (language && !form.languages.includes(language)) {
      setForm({
        ...form,
        languages: [...form.languages, language],
      });
    }
  };

  const removeLanguage = (language) => {
    setForm({
      ...form,
      languages: form.languages.filter((l) => l !== language),
    });
  };

  /* ================= CLOUDINARY IMAGE UPLOAD ================= */
  const handleImageUpload = async (file) => {
    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.error) {
        console.error("Image upload failed:", data.error.message);
      } else {
        setForm((prev) => ({ ...prev, profileImage: data.secure_url }));
        setImagePreview(data.secure_url);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateLawyerProfile(form);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch {
      console.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "location", label: "Location", icon: MapPin },
    { id: "services", label: "Services", icon: Sparkles },
  ];

  const inputClass = "w-full rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none";
  const textareaClass = "w-full rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none resize-none";

  const handleInputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.secondary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
  };

  const handleInputBlur = (e) => {
    e.currentTarget.style.borderColor = colors.outlineVariant;
    e.currentTarget.style.boxShadow = "none";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.surface }}>
        <div className={`${glassCardClass} p-8 max-w-md w-full text-center`}>
          <div className="relative">
            <div 
              className="w-24 h-24 mx-auto mb-6 relative"
              style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
            >
              <div className="absolute inset-0 rounded-2xl animate-ping opacity-20" style={{ backgroundColor: colors.secondary }}></div>
              <div className="relative rounded-2xl p-5 shadow-lg animate-bounce" style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}>
                <User className="h-14 w-14 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2" style={{ color: colors.onSurface }}>
              Loading Profile
            </h3>
            <p className="text-sm mb-6" style={{ color: colors.onSurfaceVariant }}>
              Please wait while we fetch your information...
            </p>

            <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: colors.surfaceContainerHighest }}>
              <div
                className="h-2 rounded-full animate-pulse"
                style={{ width: "60%", backgroundColor: colors.secondary }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: colors.surface }}>
      {/* Back Button */}
      
        <div className="max-w-6xl mx-auto">
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
      

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto scrollbar-hide -mb-px mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-200`}
                style={{
                  color: activeTab === tab.id ? colors.secondary : colors.onSurfaceVariant,
                  borderBottomColor: activeTab === tab.id ? colors.secondary : "transparent",
                }}
              >
                <Icon className="h-4 w-4" style={{ color: activeTab === tab.id ? colors.secondary : colors.onSurfaceVariant }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Message - Glassmorphism */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
          <div className={`${glassCardClass} px-4 py-3 flex items-center space-x-2`} style={{ backgroundColor: "rgba(76, 175, 80, 0.1)", borderColor: "#4caf5020" }}>
            <CheckCircle className="h-5 w-5" style={{ color: "#4caf50" }} />
            <span className="text-sm font-medium" style={{ color: "#2e7d32" }}>
              Profile updated successfully!
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section - Glass Card */}
          <div className={`${glassCardClass} p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex justify-center">
                <div className="relative group">
                  <div 
                    className="w-28 h-28 md:w-32 md:h-32 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-14 w-14 text-white" />
                    )}
                  </div>
                  <label
                    htmlFor="profile-image"
                    className={`absolute -bottom-2 -right-2 p-2 rounded-full cursor-pointer transition-all duration-200 shadow-lg ${
                      imageUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    style={{ backgroundColor: colors.secondary }}
                    onMouseEnter={(e) => {
                      if (!imageUploading) e.currentTarget.style.backgroundColor = colors.secondaryContainer;
                    }}
                    onMouseLeave={(e) => {
                      if (!imageUploading) e.currentTarget.style.backgroundColor = colors.secondary;
                    }}
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </label>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={imageUploading}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="font-semibold mb-1" style={{ color: colors.onSurface }}>
                  Profile Photo
                </h3>
                <p className="text-sm mb-3" style={{ color: colors.onSurfaceVariant }}>
                  Upload a professional photo to help clients recognize you
                </p>
                {imageUploading && (
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-sm" style={{ color: colors.secondary }}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile: Show active tab content */}
          <div className="md:hidden">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className={`${glassCardClass} p-6`}>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="5"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell clients about your experience, expertise, and approach..."
                    className={textareaClass}
                    style={{
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <p className="text-xs mt-2" style={{ color: colors.onSurfaceVariant }}>
                    {form.bio.length}/500 characters
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`${glassCardClass} p-6`}>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      min="0"
                      max="70"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div className={`${glassCardClass} p-6`}>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>

                <div className={`${glassCardClass} p-6`}>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Languages Spoken
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.languages?.map((lang, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm"
                        style={{ backgroundColor: `${colors.secondary}15`, color: colors.secondary }}
                      >
                        <span>{getName(lang)}</span>
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="hover:opacity-70"
                          style={{ color: colors.secondary }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add language (e.g., English, Spanish)"
                    className={inputClass}
                    style={{
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLanguage(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Professional Tab */}
            {activeTab === "professional" && (
              <div className="space-y-6">
                <div className={`${glassCardClass} p-6`}>
                  <label className="block text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Practice Areas
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2">
                    {categories?.map((area) => {
                      const Icon = getAreaIcon(getName(area));
                      return (
                        <label
                          key={area?._id || area}
                          className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            form.practiceAreas.includes(area?._id)
                              ? "border-secondary bg-secondary/10"
                              : "border-outlineVariant hover:border-secondary/50"
                          }`}
                          style={{
                            borderColor: form.practiceAreas.includes(area?._id) ? colors.secondary : colors.outlineVariant,
                            backgroundColor: form.practiceAreas.includes(area?._id) ? `${colors.secondary}10` : "transparent",
                          }}
                        >
                          <input
                            type="checkbox"
                            value={area?._id || area}
                            checked={form.practiceAreas.includes(area?._id)}
                            onChange={(e) => {
                              const value = e.target.value;
                              setForm((prev) => ({
                                ...prev,
                                practiceAreas: prev.practiceAreas.includes(value)
                                  ? prev.practiceAreas.filter((id) => id !== value)
                                  : [...prev.practiceAreas, value],
                              }));
                            }}
                            className="hidden"
                          />
                          <Icon className="h-5 w-5 mr-2" style={{ color: form.practiceAreas.includes(area?._id) ? colors.secondary : colors.outline }} />
                          <span className="text-sm" style={{ color: form.practiceAreas.includes(area?._id) ? colors.secondary : colors.onSurfaceVariant }}>
                            {getName(area)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`${glassCardClass} p-6`}>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Bar Council ID
                    </label>
                    <input
                      type="text"
                      name="barCouncilId"
                      value={String(form.barCouncilId || "")}
                      onChange={handleChange}
                      placeholder="BC-123456"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div className={`${glassCardClass} p-6`}>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={String(form.education || "")}
                      onChange={handleChange}
                      placeholder="LL.B., University Name"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>

                <div className={`${glassCardClass} p-6`}>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Consultation Fee (INR)
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={form.consultationFee || ""}
                    onChange={handleChange}
                    min="0"
                    step="50"
                    placeholder="e.g., 200"
                    className={inputClass}
                    style={{
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div className={`${glassCardClass} p-6`}>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                        Available for Online Consultation
                      </span>
                      <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
                        Offer video consultations to clients
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="availableForOnline"
                        checked={form.availableForOnline}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: form.availableForOnline ? colors.secondary : colors.outlineVariant,
                        }}
                      ></div>
                    </label>
                  </label>
                </div>
              </div>
            )}

            {/* Location Tab */}
            {activeTab === "location" && (
              <div className={`${glassCardClass} p-6`}>
                <h3 className="text-lg font-bold mb-4" style={{ color: colors.onSurface }}>
                  Office Location
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={String(form.address || "")}
                      onChange={handleChange}
                      placeholder="Street address, building, etc."
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={String(form.city || "")}
                        onChange={handleChange}
                        placeholder="City"
                        className={inputClass}
                        style={{
                          border: `1px solid ${colors.outlineVariant}`,
                          backgroundColor: colors.surfaceContainerLowest,
                          color: colors.onSurface,
                        }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={String(form.state || "")}
                        onChange={handleChange}
                        placeholder="State"
                        className={inputClass}
                        style={{
                          border: `1px solid ${colors.outlineVariant}`,
                          backgroundColor: colors.surfaceContainerLowest,
                          color: colors.onSurface,
                        }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={String(form.pincode || "")}
                      onChange={handleChange}
                      placeholder="e.g., 10001"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <div className={`${glassCardClass} p-6`}>
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                  Services Offered
                </label>

                <div className="space-y-3 mb-4">
                  {form.services?.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ backgroundColor: colors.surfaceContainerHighest }}
                    >
                      <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                        {getName(service)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="transition-colors"
                        style={{ color: colors.error }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Add a service (e.g., Contract Review)"
                    className={`flex-1 ${inputClass}`}
                    style={{
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addService();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addService}
                    className="px-4 py-2 rounded-xl text-white transition-all duration-200"
                    style={{ backgroundColor: colors.secondary }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={String(form.website || "")}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className={inputClass}
                    style={{
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Show all sections */}
          <div className="hidden md:block space-y-6">
            {/* Basic Info */}
            <div className={`${glassCardClass} p-8`}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.onSurface }}>
                <User className="h-5 w-5 mr-2" style={{ color: colors.secondary }} />
                Basic Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="5"
                    value={String(form.bio || "")}
                    onChange={handleChange}
                    placeholder="Tell clients about your experience, expertise, and approach..."
                    className={textareaClass}
                    style={{
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                  <p className="text-xs mt-2" style={{ color: colors.onSurfaceVariant }}>
                    {form.bio?.length || 0}/500 characters
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={form.experience || ""}
                      onChange={handleChange}
                      min="0"
                      max="70"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={String(form.phone || "")}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Languages Spoken
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.languages?.map((lang, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm"
                        style={{ backgroundColor: `${colors.secondary}15`, color: colors.secondary }}
                      >
                        <span>{getName(lang)}</span>
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="hover:opacity-70"
                          style={{ color: colors.secondary }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add language (e.g., English, Spanish)"
                    className={inputClass}
                    style={{
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addLanguage(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className={`${glassCardClass} p-8`}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.onSurface }}>
                <Briefcase className="h-5 w-5 mr-2" style={{ color: colors.secondary }} />
                Professional Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Practice Areas
                  </label>
                  <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto p-2">
                    {categories?.map((area) => {
                      const Icon = getAreaIcon(getName(area));
                      return (
                        <label
                          key={area?._id || area}
                          className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            form.practiceAreas.includes(area?._id || area)
                              ? "border-secondary bg-secondary/10"
                              : "border-outlineVariant hover:border-secondary/50"
                          }`}
                          style={{
                            borderColor: form.practiceAreas.includes(area?._id || area) ? colors.secondary : colors.outlineVariant,
                            backgroundColor: form.practiceAreas.includes(area?._id || area) ? `${colors.secondary}10` : "transparent",
                          }}
                        >
                          <input
                            type="checkbox"
                            value={area?._id || area}
                            checked={form.practiceAreas.includes(area?._id || area)}
                            onChange={(e) => {
                              const value = e.target.value;
                              setForm((prev) => ({
                                ...prev,
                                practiceAreas: prev.practiceAreas.includes(value)
                                  ? prev.practiceAreas.filter((id) => id !== value)
                                  : [...prev.practiceAreas, value],
                              }));
                            }}
                            className="hidden"
                          />
                          <Icon className="h-5 w-5 mr-2" style={{ color: form.practiceAreas.includes(area?._id || area) ? colors.secondary : colors.outline }} />
                          <span className="text-sm" style={{ color: form.practiceAreas.includes(area?._id || area) ? colors.secondary : colors.onSurfaceVariant }}>
                            {getName(area)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Bar Council ID
                    </label>
                    <input
                      type="text"
                      name="barCouncilId"
                      value={String(form.barCouncilId || "")}
                      onChange={handleChange}
                      placeholder="BC-123456"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={String(form.education || "")}
                      onChange={handleChange}
                      placeholder="LL.B., University Name"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Consultation Fee (INR)
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={form.consultationFee || ""}
                    onChange={handleChange}
                    min="0"
                    step="50"
                    placeholder="e.g., 200"
                    className={inputClass}
                    style={{
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div className={`flex items-center justify-between p-4 rounded-xl`} style={{ backgroundColor: colors.surfaceContainerHighest }}>
                  <div>
                    <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Available for Online Consultation
                    </span>
                    <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>
                      Offer video consultations to clients
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="availableForOnline"
                      checked={form.availableForOnline}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                      style={{
                        backgroundColor: form.availableForOnline ? colors.secondary : colors.outlineVariant,
                      }}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className={`${glassCardClass} p-8`}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.onSurface }}>
                <MapPin className="h-5 w-5 mr-2" style={{ color: colors.secondary }} />
                Office Location
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={String(form.address || "")}
                    onChange={handleChange}
                    placeholder="Street address, building, etc."
                    className={inputClass}
                    style={{
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={String(form.city || "")}
                      onChange={handleChange}
                      placeholder="City"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={String(form.state || "")}
                      onChange={handleChange}
                      placeholder="State"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={String(form.pincode || "")}
                      onChange={handleChange}
                      placeholder="e.g., 10001"
                      className={inputClass}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className={`${glassCardClass} p-8`}>
              <h2 className="text-xl font-bold mb-6 flex items-center" style={{ color: colors.onSurface }}>
                <Sparkles className="h-5 w-5 mr-2" style={{ color: colors.secondary }} />
                Services & Contact
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Services Offered
                  </label>

                  <div className="space-y-3 mb-4">
                    {form.services?.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl"
                        style={{ backgroundColor: colors.surfaceContainerHighest }}
                      >
                        <span className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                          {getName(service)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="transition-colors"
                          style={{ color: colors.error }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="Add a service (e.g., Contract Review)"
                      className={`flex-1 ${inputClass}`}
                      style={{
                        border: `1px solid ${colors.outlineVariant}`,
                        backgroundColor: colors.surfaceContainerLowest,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addService();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addService}
                      className="px-4 py-2 rounded-xl text-white transition-all duration-200"
                      style={{ backgroundColor: colors.secondary }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={String(form.website || "")}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className={inputClass}
                    style={{
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest,
                      color: colors.onSurface,
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button - Fixed at bottom on mobile */}
          
            <div className="max-w-4xl mx-auto">
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-8 py-3 md:py-3 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                style={{ 
                  backgroundColor: colors.secondary,
                  color: "white",
                  boxShadow: `0 4px 12px ${colors.secondary}40`
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.currentTarget.style.backgroundColor = colors.secondaryContainer;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.currentTarget.style.backgroundColor = colors.secondary;
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          
        </form>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -100%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default EditProfile;