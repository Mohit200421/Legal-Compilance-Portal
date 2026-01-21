import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/admincss/addlawyer.css";

export default function AddLawyer() {
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    state: "",
    city: "",
    category: "",
    description: "",
  });

  const [profileImg, setProfileImg] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD INITIAL DATA ================= */

  useEffect(() => {
    fetchStates();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (form.state) {
      fetchCities(form.state);
      setForm((prev) => ({ ...prev, city: "" }));
    }
  }, [form.state]);

  const fetchStates = async () => {
    const res = await API.get("/admin/master/state");
    setStates(res.data);
  };

  const fetchCities = async (stateId) => {
    const res = await API.get(`/admin/master/city/${stateId}`);
    setCities(res.data);
  };

  const fetchCategories = async () => {
    const res = await API.get("/admin/master/category");
    setCategories(res.data);
  };

  /* ================= FORM HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, phone, experience, state, city, category } = form;

    if (!name || !email || !phone || !experience || !state || !city || !category) {
      alert("Please fill all required fields");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      if (profileImg) fd.append("profile", profileImg);
      if (documentFile) fd.append("document", documentFile);

      await API.post("/admin/lawyers", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Lawyer added successfully");
      navigate("/admin/manage-lawyers");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to add lawyer");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="add-lawyer-container">
      <h2>Add Lawyer</h2>

      <form onSubmit={handleSubmit} className="form-card">

        <div className="form-row">
          <label>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Phone *</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Experience (years) *</label>
          <input name="experience" value={form.experience} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>State *</label>
          <select name="state" value={form.state} onChange={handleChange}>
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>
                {s.stateName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>City *</label>
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            disabled={!form.state}
          >
            <option value="">
              {form.state ? "Select City" : "Select State First"}
            </option>
            {cities.map((c) => (
              <option key={c._id} value={c._id}>
                {c.cityName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Category *</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Profile Image</label>
          <input type="file" onChange={(e) => setProfileImg(e.target.files[0])} />
        </div>

        <div className="form-row">
          <label>Document</label>
          <input type="file" onChange={(e) => setDocumentFile(e.target.files[0])} />
        </div>

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Lawyer"}
        </button>
      </form>
    </div>
  );
}
