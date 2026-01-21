import { useEffect, useState } from "react";
import API from "../../api/axios";
import "./request.css";
import ChatModal from "../../components/chat/ChatModal";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Chat modal state
  const [openChat, setOpenChat] = useState(false);
  const [chatUser, setChatUser] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/requests");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/lawyer/requests/${id}/status`, { status });
      alert(res.data.msg || "Updated");
      fetchRequests();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Failed to update");
    }
  };

  const handleOpenChat = (user) => {
    if (!user?._id) return alert("User not found");
    setChatUser(user);
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setChatUser(null);
  };

  return (
    <div>
      <h1 style={{ fontSize: "26px", marginBottom: "10px" }}>
        📩 User Requests
      </h1>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {requests.map((r) => (
            <div
              key={r._id}
              style={{
                background: "white",
                padding: "16px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ marginBottom: "6px" }}>{r.subject}</h3>

              <p style={{ marginBottom: "8px", color: "#334155" }}>
                {r.message}
              </p>

              <small style={{ color: "#64748b" }}>
                From: {r.userId?.name} ({r.userId?.email})
              </small>

              <p style={{ marginTop: "8px" }}>
                Status:{" "}
                <b
                  style={{
                    color:
                      r.status === "Accepted"
                        ? "green"
                        : r.status === "Rejected"
                        ? "red"
                        : "#0ea5e9",
                  }}
                >
                  {r.status}
                </b>
              </p>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {/* ✅ CHAT only if Accepted */}
                {r.status === "Accepted" && (
                  <button
                    onClick={() => handleOpenChat(r.userId)}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      padding: "8px 14px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    💬 Chat
                  </button>
                )}

                {/* Accept */}
                <button
                  onClick={() => updateStatus(r._id, "Accepted")}
                  disabled={r.status === "Accepted"}
                  style={{
                    background: "#16a34a",
                    color: "white",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    opacity: r.status === "Accepted" ? 0.6 : 1,
                  }}
                >
                  ✅ Accept
                </button>

                {/* Reject */}
                <button
                  onClick={() => updateStatus(r._id, "Rejected")}
                  disabled={r.status === "Rejected"}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    opacity: r.status === "Rejected" ? 0.6 : 1,
                  }}
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ CHAT MODAL */}
      <ChatModal
        open={openChat}
        onClose={handleCloseChat}
        receiverId={chatUser?._id}
        receiverName={chatUser?.name}
      />
    </div>
  );
}
