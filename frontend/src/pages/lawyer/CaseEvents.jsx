import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function CaseEvents() {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");

  const [events, setEvents] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // ✅ editing state
  const [editingEventId, setEditingEventId] = useState(null);

  // form
  const [eventTitle, setEventTitle] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [eventDate, setEventDate] = useState("");

  // Load cases
  const fetchCases = async () => {
    try {
      setLoadingCases(true);
      const res = await API.get("/lawyer/case");
      setCases(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load cases ❌");
    } finally {
      setLoadingCases(false);
    }
  };

  // Load events of selected case
  const fetchEvents = async (caseId) => {
    if (!caseId) return;

    try {
      setLoadingEvents(true);
      const res = await API.get(`/lawyer/case/${caseId}/event`);
      setEvents(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load events ❌");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (selectedCaseId) fetchEvents(selectedCaseId);
  }, [selectedCaseId]);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!selectedCaseId) return toast.error("Please select a case first!");
    if (!eventTitle.trim() || !eventDate)
      return toast.error("Event title & date required!");

    try {
      if (editingEventId) {
        // ✅ UPDATE
        const res = await API.put(`/lawyer/case/event/${editingEventId}`, {
          eventTitle,
          eventDetails,
          eventDate,
        });

        toast.success(res.data?.msg || "Event updated ✅");
        setEditingEventId(null);
      } else {
        // ✅ CREATE
        const res = await API.post("/lawyer/case/event", {
          caseId: selectedCaseId,
          eventTitle,
          eventDetails,
          eventDate,
        });

        toast.success(res.data?.msg || "Event added ✅");
      }

      setEventTitle("");
      setEventDetails("");
      setEventDate("");

      fetchEvents(selectedCaseId);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed ❌");
    }
  };

  const handleEditClick = (event) => {
    setEditingEventId(event._id);
    setEventTitle(event.eventTitle);
    setEventDetails(event.eventDetails || "");
    setEventDate(event.eventDate?.slice(0, 10)); // yyyy-mm-dd
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setEventTitle("");
    setEventDetails("");
    setEventDate("");
    toast("Edit cancelled");
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      const res = await API.delete(`/lawyer/case/event/${eventId}`);
      toast.success(res.data?.msg || "Event deleted ✅");
      fetchEvents(selectedCaseId);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to delete event ❌");
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: "26px", marginBottom: "10px" }}>📅 Case Events</h1>

      {/* SELECT CASE */}
      <div
        style={{
          background: "white",
          padding: "16px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Select Case</h3>

        {loadingCases ? (
          <p>Loading cases...</p>
        ) : cases.length === 0 ? (
          <p>No cases found. Please add a case first.</p>
        ) : (
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <option value="">-- Select Case --</option>
            {cases.map((c) => (
              <option key={c._id} value={c._id}>
                {c.caseTitle} (Client: {c.clientName})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ADD / EDIT EVENT */}
      <form
        onSubmit={handleAddEvent}
        style={{
          background: "white",
          padding: "16px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 0 10px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>
          {editingEventId ? "✏️ Edit Case Event" : "➕ Add Case Event"}
        </h3>

        <input
          type="text"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <textarea
          placeholder="Event Details (optional)"
          value={eventDetails}
          onChange={(e) => setEventDetails(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            background: editingEventId ? "#16a34a" : "#2563eb",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {editingEventId ? "✅ Save Changes" : "➕ Add Event"}
        </button>

        {editingEventId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            style={{
              width: "100%",
              marginTop: "10px",
              background: "#64748b",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ❌ Cancel Edit
          </button>
        )}
      </form>

      {/* EVENTS LIST */}
      <div
        style={{
          background: "white",
          padding: "16px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginBottom: "12px" }}>Events List</h3>

        {!selectedCaseId ? (
          <p>Please select a case to view events.</p>
        ) : loadingEvents ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events found for this case.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {events.map((e) => (
              <div
                key={e._id}
                style={{
                  border: "1px solid #eee",
                  padding: "12px",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <h4 style={{ marginBottom: "6px" }}>{e.eventTitle}</h4>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleEditClick(e)}
                      style={{
                        background: "#f59e0b",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(e._id)}
                      style={{
                        background: "#dc2626",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                <p style={{ marginBottom: "6px", color: "#334155" }}>
                  {e.eventDetails || "No details"}
                </p>

                <small style={{ color: "#64748b" }}>
                  Date: {new Date(e.eventDate).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
