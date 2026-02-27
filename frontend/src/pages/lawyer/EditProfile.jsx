import { useEffect, useState } from "react";
import API from "../../api/axios";
import { updateLawyerProfile } from "../../api/lawyerApi";
import toast from "react-hot-toast";

const EditProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const [form, setForm] = useState({
    bio: "",
    experience: "",
    practiceAreas: [],
    state: "",
    city: "",
    services: [],
    profileImage: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [categories, setCategories] = useState([]);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await API.get("/lawyer/profile");
        const data = res.data.data;

        setForm({
          bio: data.bio || "",
          experience: data.experience || "",
          practiceAreas: data.practiceAreas?.map((p) => p._id) || [],
          state: data.location?.state || "",
          city: data.location?.city || "",
          services: data.services || [],
          profileImage: data.profileImage || "",
        });

        setImagePreview(data.profileImage || "");
      } catch {
        toast.error("Failed to load profile");
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
      .catch(() => toast.error("Failed to load practice areas"));
  }, []);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePracticeAreas = (e) => {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm({ ...form, practiceAreas: values });
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
        toast.error("Image upload failed: " + data.error.message);
      } else {
        setForm((prev) => ({ ...prev, profileImage: data.secure_url }));
        setImagePreview(data.secure_url);
        toast.success("Profile image uploaded");
      }
    } catch (error) {
      toast.error("Image upload failed");
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
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PROFILE IMAGE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={imageUploading}
            />
          </div>
        </div>

        {/* BIO */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            rows="4"
            value={form.bio}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* EXPERIENCE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Experience (years)
          </label>
          <input
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* PRACTICE AREAS */}
        {/* PRACTICE AREAS (MULTI-SELECT CHECKBOXES) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Practice Areas
          </label>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border rounded p-3 max-h-56 overflow-y-auto">
            {categories.map((area) => (
              <label
                key={area._id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={area._id}
                  checked={form.practiceAreas.includes(area._id)}
                  onChange={(e) => {
                    const value = e.target.value;

                    setForm((prev) => ({
                      ...prev,
                      practiceAreas: prev.practiceAreas.includes(value)
                        ? prev.practiceAreas.filter((id) => id !== value)
                        : [...prev.practiceAreas, value],
                    }));
                  }}
                  className="accent-purple-600"
                />
                {area.name}
              </label>
            ))}
          </div>
        </div>

        {/* STATE (TEXT INPUT) */}
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Enter your state"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* CITY (TEXT INPUT) */}
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter your city"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
