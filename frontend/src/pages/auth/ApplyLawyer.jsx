import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/applylawyer.css";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 🔥 backend api later connect करू (currently dummy)
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

  return (
    <div className="applylawyer-wrapper">
      <form className="applylawyer-form" onSubmit={handleSubmit}>
        <h2 className="applylawyer-title">Lawyer Registration Request</h2>
        <p className="applylawyer-subtitle">
          Fill your details. Admin will verify & approve your access.
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="barId"
          placeholder="Bar Council ID"
          value={form.barId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="specialization"
          placeholder="Specialization (eg. Criminal, Civil, Property)"
          value={form.specialization}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="experience"
          placeholder="Experience (Years)"
          value={form.experience}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Message (Optional)"
          value={form.message}
          onChange={handleChange}
          rows={4}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
