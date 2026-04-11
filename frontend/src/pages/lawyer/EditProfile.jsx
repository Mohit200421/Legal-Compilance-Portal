import { useEffect, useState } from "react";
import API from "../../api/axios";
import { getMyProfile, updateLawyerProfile } from "../../api/lawyerApi";
// import toast from "react-hot-toast";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 shadow-lg animate-bounce">
                <User className="h-14 w-14 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Loading Profile
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Please wait while we fetch your information...
            </p>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Header - Only with back button, no title */}

      <div className="max-w-6xl mx-auto px-4">
        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto scrollbar-hide -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
          <div className="bg-green-100 border border-green-200 rounded-lg px-4 py-3 shadow-lg flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Profile updated successfully!
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section - Always Visible */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-xl overflow-hidden">
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
                    className={`absolute -bottom-2 -right-2 p-2 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-lg ${
                      imageUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
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
                <h3 className="font-semibold text-gray-900 mb-1">
                  Profile Photo
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Upload a professional photo to help clients recognize you
                </p>
                {imageUploading && (
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-purple-600">
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
                {/* Bio */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="5"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Tell clients about your experience, expertise, and approach..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    {form.bio.length}/500 characters
                  </p>
                </div>

                {/* Experience & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      min="0"
                      max="70"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.languages?.map((lang, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm"
                      >
                        <span>{getName(lang)}</span>
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="hover:text-purple-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add language (e.g., English, Spanish)"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
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
                {/* Practice Areas */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Practice Areas
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2">
                    {categories?.map((area) => {
                      const Icon = getAreaIcon(getName(area));
                      return (
                        <label
                          key={area?._id || area}
                          className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            form.practiceAreas.includes(area?._id)
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={area?._id || area}
                            checked={form.practiceAreas.includes(area?._id)}
                            onChange={(e) => {
                              const value = e.target.value;
                              setForm((prev) => ({
                                ...prev,
                                practiceAreas: prev.practiceAreas.includes(
                                  value
                                )
                                  ? prev.practiceAreas.filter(
                                      (id) => id !== value
                                    )
                                  : [...prev.practiceAreas, value],
                              }));
                            }}
                            className="hidden"
                          />
                          <Icon
                            className={`h-5 w-5 mr-2 ${
                              form.practiceAreas.includes(area?._id)
                                ? "text-purple-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              form.practiceAreas.includes(area?._id)
                                ? "text-purple-700 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {getName(area)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Bar Council ID & Education */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bar Council ID
                    </label>
                    <input
                      type="text"
                      name="barCouncilId"
                      value={String(form.barCouncilId || "")}
                      onChange={handleChange}
                      placeholder="BC-123456"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={String(form.education || "")}
                      onChange={handleChange}
                      placeholder="LL.B., University Name"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Fee ($)
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={form.consultationFee || ""}
                    onChange={handleChange}
                    min="0"
                    step="50"
                    placeholder="e.g., 200"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                {/* Online Consultation Toggle */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Available for Online Consultation
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Offer video consultations to clients
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      name="availableForOnline"
                      checked={form.availableForOnline}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Location Tab */}
            {activeTab === "location" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Office Location
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={String(form.address || "")}
                        onChange={handleChange}
                        placeholder="Street address, building, etc."
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={String(form.city || "")}
                          onChange={handleChange}
                          placeholder="City"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={String(form.state || "")}
                          onChange={handleChange}
                          placeholder="State"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={String(form.pincode || "")}
                        onChange={handleChange}
                        placeholder="e.g., 10001"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Services Offered
                  </label>

                  <div className="space-y-3 mb-4">
                    {form.services?.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <span className="text-sm text-gray-700">
                          {getName(service)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-red-500 hover:text-red-700"
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
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
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
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                </div>

                {/* Website */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={String(form.website || "")}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Show all sections */}
          <div className="hidden md:block space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 text-purple-600 mr-2" />
                Basic Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    rows="5"
                    value={String(form.bio || "")}
                    onChange={handleChange}
                    placeholder="Tell clients about your experience, expertise, and approach..."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    {form.bio?.length || 0}/500 characters
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={form.experience || ""}
                      onChange={handleChange}
                      min="0"
                      max="70"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={String(form.phone || "")}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.languages?.map((lang, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm"
                      >
                        <span>{getName(lang)}</span>
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="hover:text-purple-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add language (e.g., English, Spanish)"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Briefcase className="h-5 w-5 text-purple-600 mr-2" />
                Professional Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Practice Areas
                  </label>
                  <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto p-2">
                    {categories?.map((area) => {
                      const Icon = getAreaIcon(getName(area));
                      return (
                        <label
                          key={area?._id || area}
                          className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            form.practiceAreas.includes(area?._id || area)
                              ? "border-purple-600 bg-purple-50"
                              : "border-gray-200 hover:border-purple-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={area?._id || area}
                            checked={form.practiceAreas.includes(
                              area?._id || area
                            )}
                            onChange={(e) => {
                              const value = e.target.value;
                              setForm((prev) => ({
                                ...prev,
                                practiceAreas: prev.practiceAreas.includes(
                                  value
                                )
                                  ? prev.practiceAreas.filter(
                                      (id) => id !== value
                                    )
                                  : [...prev.practiceAreas, value],
                              }));
                            }}
                            className="hidden"
                          />
                          <Icon
                            className={`h-5 w-5 mr-2 ${
                              form.practiceAreas.includes(area?._id || area)
                                ? "text-purple-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              form.practiceAreas.includes(area?._id || area)
                                ? "text-purple-700 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {getName(area)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bar Council ID
                    </label>
                    <input
                      type="text"
                      name="barCouncilId"
                      value={String(form.barCouncilId || "")}
                      onChange={handleChange}
                      placeholder="BC-123456"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      value={String(form.education || "")}
                      onChange={handleChange}
                      placeholder="LL.B., University Name"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Available for Online Consultation
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-5 w-5 text-purple-600 mr-2" />
                Office Location
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={String(form.address || "")}
                    onChange={handleChange}
                    placeholder="Street address, building, etc."
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={String(form.city || "")}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={String(form.state || "")}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={String(form.pincode || "")}
                      onChange={handleChange}
                      placeholder="e.g., 10001"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                Services & Contact
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Services Offered
                  </label>

                  <div className="space-y-3 mb-4">
                    {form.services?.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <span className="text-sm text-gray-700">
                          {getName(service)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-red-500 hover:text-red-700"
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
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
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
                      className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={String(form.website || "")}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button - Fixed at bottom on mobile */}
          <div className="md:relative fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:p-0 md:bg-transparent md:border-0 md:static z-40">
            <div className="max-w-4xl mx-auto">
              <button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-8 py-3 md:py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
