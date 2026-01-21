import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function UserDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Search
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL;


  // ---------------- FETCH USER DOCUMENTS ----------------
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/documents");
      setDocuments(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ---------------- SEARCH OCR DOCUMENTS ----------------
  const handleSearch = async () => {
    if (!query.trim()) {
      fetchDocuments();
      return;
    }

    try {
      setSearchLoading(true);
      const res = await API.get(`/user/search-documents?query=${query}`);
      setDocuments(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to search documents");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleView = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    window.open(fileUrl, "_blank");
  };

  const handleDownload = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = doc.filename || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 style={{ fontSize: "26px", marginBottom: "10px" }}>
        📄 My Documents
      </h1>

      {/* ✅ SEARCH BAR */}
      <div
        style={{
          background: "white",
          padding: "14px",
          borderRadius: "10px",
          marginBottom: "15px",
          boxShadow: "0 0 10px rgba(0,0,0,0.08)",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search inside OCR text..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🔍 Search
        </button>

        <button
          onClick={() => {
            setQuery("");
            fetchDocuments();
          }}
          style={{
            background: "#64748b",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ❌ Clear
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading documents...</p>
      ) : searchLoading ? (
        <p>Searching documents...</p>
      ) : documents.length === 0 ? (
        <p>No documents assigned to you.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {documents.map((d) => (
            <div
              key={d._id}
              style={{
                background: "white",
                padding: "14px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{d.filename}</h3>

                <small style={{ color: "#64748b" }}>
                  Uploaded by:{" "}
                  <b>
                    {d.uploaderId?.name} ({d.uploaderId?.email})
                  </b>
                </small>

                <br />

                <small style={{ color: "#64748b" }}>
                  Uploaded on: {new Date(d.createdAt).toLocaleString()}
                </small>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleView(d)}
                  style={{
                    background: "#16a34a",
                    color: "white",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  👁 View
                </button>

                <button
                  onClick={() => handleDownload(d)}
                  style={{
                    background: "#0ea5e9",
                    color: "white",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  ⬇ Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
