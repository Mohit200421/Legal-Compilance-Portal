import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [caseTitle, setCaseTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [caseType, setCaseType] = useState("");

  const fetchCases = async () => {
    const res = await API.get("/lawyer/case");
    setCases(res.data);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleAddCase = async (e) => {
    e.preventDefault();

    if (!caseTitle || !clientName || !caseType) return alert("Fill all fields");

    await API.post("/lawyer/case", { caseTitle, clientName, caseType });

    setCaseTitle("");
    setClientName("");
    setCaseType("");

    fetchCases();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this case?")) return;
    await API.delete(`/lawyer/case/${id}`);
    fetchCases();
  };

  return (
    <div>
      <h1 style={{ fontSize: "26px", marginBottom: "10px" }}>📌 Cases</h1>

      <form onSubmit={handleAddCase} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Case Title"
          value={caseTitle}
          onChange={(e) => setCaseTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          placeholder="Case Type"
          value={caseType}
          onChange={(e) => setCaseType(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
          }}
        >
          ➕ Add Case
        </button>
      </form>

      <h3>My Cases</h3>

      {cases.length === 0 ? (
        <p>No cases found</p>
      ) : (
        cases.map((c) => (
          <div
            key={c._id}
            style={{
              border: "1px solid #eee",
              padding: "12px",
              borderRadius: "10px",
              marginTop: "10px",
            }}
          >
            <h4>{c.caseTitle}</h4>
            <p>Client: {c.clientName}</p>
            <p>Type: {c.caseType}</p>

            <button
              onClick={() => handleDelete(c._id)}
              style={{
                marginTop: "10px",
                background: "#dc2626",
                color: "white",
                padding: "8px 14px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              🗑 Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
