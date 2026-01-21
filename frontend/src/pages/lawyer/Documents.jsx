import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./Documents.css";


export default function Documents() {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ for assign dropdown
  const [requests, setRequests] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  // ✅ OCR Modal
  const [openOCR, setOpenOCR] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);

  const BACKEND_URL = "http://localhost:5000";

  // ---------------- FETCH DOCUMENTS ----------------
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/document");
      setDocuments(res.data);
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH ACCEPTED REQUESTS ----------------
  const fetchAcceptedRequests = async () => {
    try {
      const res = await API.get("/lawyer/requests");

      // only accepted requests
      const accepted = res.data.filter((r) => r.status === "Accepted");
      setRequests(accepted);
    } catch (err) {
      console.log(err);
      alert("Failed to load accepted requests");
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchAcceptedRequests();
  }, []);

  // ---------------- UPLOAD ----------------
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a file first!");
    if (!selectedUserId) return alert("Please select a user to assign!");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assignedUserId", selectedUserId);

      const res = await API.post("/lawyer/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.msg || "Document uploaded!");
      setFile(null);
      setSelectedUserId("");
      fetchDocuments();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.error || "Upload failed");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await API.delete(`/lawyer/document/${id}`);
      alert(res.data.msg || "Deleted!");
      fetchDocuments();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.error || "Delete failed");
    }
  };

  // ---------------- VIEW ----------------
  const handleView = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    window.open(fileUrl, "_blank");
  };

  // ---------------- DOWNLOAD ----------------
  const handleDownload = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = doc.filename || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------------- OCR (RUN) ----------------
  const handleRunOCR = async (docId) => {
    try {
      setOcrLoading(true);
      const res = await API.get(`/ocr/${docId}`);
      alert(res.data.msg || "OCR Done!");
      fetchDocuments();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "OCR failed");
    } finally {
      setOcrLoading(false);
    }
  };

  // ---------------- OCR (VIEW TEXT) ----------------
  const handleViewOCR = async (docId) => {
    try {
      setOcrLoading(true);
      setOpenOCR(true);
      setOcrText("");

      const res = await API.get(`/ocr/text/${docId}`);
      setOcrText(res.data.extractedText || "No OCR text found");
    } catch (err) {
      console.log(err);
      setOcrText(err?.response?.data?.msg || "Failed to load OCR text");
    } finally {
      setOcrLoading(false);
    }
  };

  return (
    <div className="documents-page">
      <h1 className="documents-title">📄 Documents Module</h1>

      {/* ✅ UPLOAD */}
      <form onSubmit={handleUpload} className="documents-uploadCard">
        <h3 className="documents-subTitle">Upload Document</h3>

        {/* ✅ Select User */}
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="documents-select"
        >
          <option value="">-- Select User (Accepted Requests) --</option>

          {requests.length === 0 ? (
            <option disabled>No accepted requests found</option>
          ) : (
            requests.map((r) => (
              <option key={r._id} value={r.userId?._id}>
                {r.userId?.name} ({r.userId?.email})
              </option>
            ))
          )}
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="documents-fileInput"
        />

        <button type="submit" className="documents-uploadBtn">
          ⬆ Upload & Assign
        </button>
      </form>

      {/* ✅ LIST */}
      <div className="documents-listCard">
        <h3 className="documents-subTitle">Uploaded Documents</h3>

        {loading ? (
          <p className="documents-infoText">Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="documents-infoText">No documents uploaded yet.</p>
        ) : (
          <div className="documents-list">
            {documents.map((d) => (
              <div key={d._id} className="documents-item">
                <div className="documents-left">
                  <h4 className="documents-fileName">{d.filename}</h4>

                  <small className="documents-date">
                    Uploaded: {new Date(d.createdAt).toLocaleString()}
                  </small>

                  <p className="documents-meta">
                    Assigned To:{" "}
                    <b>
                      {d.assignedUserId?.name
                        ? `${d.assignedUserId.name} (${d.assignedUserId.email})`
                        : "Not Assigned"}
                    </b>
                  </p>

                  <p className="documents-meta">
                    OCR Status:{" "}
                    <b className={d.ocrTextId ? "ocr-done" : "ocr-pending"}>
                      {d.ocrTextId ? "Completed" : "Not Done"}
                    </b>
                  </p>
                </div>

                <div className="documents-actions">
                  <button
                    onClick={() => handleView(d)}
                    className="documents-btn view"
                  >
                    👁 View
                  </button>

                  <button
                    onClick={() => handleDownload(d)}
                    className="documents-btn download"
                  >
                    ⬇ Download
                  </button>

                  <button
                    onClick={() => handleRunOCR(d._id)}
                    disabled={ocrLoading}
                    className="documents-btn ocr"
                  >
                    🧠 Run OCR
                  </button>

                  <button
                    onClick={() => handleViewOCR(d._id)}
                    className="documents-btn ocrView"
                  >
                    📄 View OCR
                  </button>

                  <button
                    onClick={() => handleDelete(d._id)}
                    className="documents-btn delete"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ OCR TEXT MODAL */}
      {openOCR && (
        <div className="documents-modalBackdrop" onClick={() => setOpenOCR(false)}>
          <div
            className="documents-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="documents-modalTitle">📄 OCR Extracted Text</h2>

            {ocrLoading ? (
              <p className="documents-infoText">Loading OCR text...</p>
            ) : (
              <textarea
                value={ocrText}
                readOnly
                className="documents-ocrTextarea"
              />
            )}

            <button
              onClick={() => setOpenOCR(false)}
              className="documents-closeBtn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
